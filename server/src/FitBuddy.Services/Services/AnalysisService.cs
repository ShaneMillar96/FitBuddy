using AutoMapper;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Dal.Models.application;
using FitBuddy.Services.Dtos.Analysis;
using Microsoft.AspNetCore.Http;
using FitBuddy.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitBuddy.Services.Services;

public class AnalysisService : IAnalysisService
{
    private readonly IFitBudContext _context;
    private readonly IMapper _mapper;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly string _videoStoragePath = "uploads/videos"; // Adjust for your storage in prod environments (e.g., S3)

    public AnalysisService(IFitBudContext context, IMapper mapper, IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _mapper = mapper;
        _httpClientFactory = httpClientFactory;
    }

    public async Task<int> UploadAndAnalyzeVideoAsync(int memberId, IFormFile videoFile, string exerciseType)
    {
        Directory.CreateDirectory(_videoStoragePath);
        var filePath = Path.Combine(_videoStoragePath, $"{Guid.NewGuid()}_{videoFile.FileName}");
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await videoFile.CopyToAsync(stream);
        }

        var client = _httpClientFactory.CreateClient();
        var content = new MultipartFormDataContent();
        content.Add(new StreamContent(File.OpenRead(filePath)), "video", Path.GetFileName(filePath));
        content.Add(new StringContent(exerciseType), "exercise_type");

        var response = await client.PostAsync("http://localhost:5001/analyze", content); // Adjust URL for production
        response.EnsureSuccessStatusCode();
        var analysisResult = await response.Content.ReadAsStringAsync();

        var video = new ExerciseVideo
        {
            MemberId = memberId,
            FilePath = filePath,
            ExerciseType = exerciseType,
            AnalysisResult = analysisResult,
            CreatedDate = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)
        };
        await _context.AddAsync(video);
        await _context.SaveChangesAsync();

        File.Delete(filePath);

        return video.Id;
    }

    public async Task<ExerciseVideoDto> GetVideoAnalysisAsync(int videoId)
    {
        var video = await _context.Get<ExerciseVideo>()
            .FirstOrDefaultAsync(v => v.Id == videoId);
        return _mapper.Map<ExerciseVideoDto>(video);
    }
}