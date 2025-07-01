using AutoMapper;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Dal.Models.application;
using FitBuddy.Services.Dtos.Analysis;
using Microsoft.AspNetCore.Http;
using FitBuddy.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using FitBuddy.Dal.Enums;

namespace FitBuddy.Services.Services;

public class AnalysisService : IAnalysisService
{
    private readonly IFitBudContext _context;
    private readonly IMapper _mapper;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IWebHostEnvironment _webHostEnvironment;
    private readonly string _videoStoragePath = "uploads/videos"; // Adjust for production (e.g., S3)
    private readonly bool _deleteUploadedVideos = true; // Configure this via appsettings in production

    public AnalysisService(
        IFitBudContext context,
        IMapper mapper,
        IHttpClientFactory httpClientFactory,
        IWebHostEnvironment webHostEnvironment)
    {
        _context = context;
        _mapper = mapper;
        _httpClientFactory = httpClientFactory;
        _webHostEnvironment = webHostEnvironment ?? throw new ArgumentNullException(nameof(webHostEnvironment));
    }

    public async Task<int> UploadAndAnalyzeVideoAsync(int memberId, IFormFile videoFile, int exerciseTypeId)
    {
        // Safely get WebRootPath with fallback to a default directory
        string webRootPath = _webHostEnvironment?.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        string fullStoragePath = Path.Combine(webRootPath, _videoStoragePath);
        Directory.CreateDirectory(fullStoragePath);

        var fileName = $"{Guid.NewGuid()}_{videoFile.FileName}";
        var filePath = Path.Combine(fullStoragePath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await videoFile.CopyToAsync(stream);
        }

        // Generate a web-accessible URL for the video
        var videoUrl = $"/{_videoStoragePath}/{fileName}";

        // Call AI microservice
        var client = _httpClientFactory.CreateClient();
        var content = new MultipartFormDataContent();
        content.Add(new StreamContent(File.OpenRead(filePath)), "video", Path.GetFileName(filePath));
        content.Add(new StringContent(exerciseTypeId.ToString()), "exercise_type"); // Ensure it's sent as an integer string

        var response = await client.PostAsync("http://localhost:5001/analyze", content);
        response.EnsureSuccessStatusCode();
        var analysisResult = await response.Content.ReadAsStringAsync();

        // Save to database with URL
        var video = new ExerciseVideo
        {
            MemberId = memberId,
            FilePath = videoUrl,
            ExerciseTypeId = exerciseTypeId,
            AnalysisResult = analysisResult,
            CreatedDate = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)
        };
        await _context.AddAsync(video);
        await _context.SaveChangesAsync();

        // Clean up uploaded video file if configured to do so
        if (_deleteUploadedVideos)
        {
            try
            {
                File.Delete(filePath);
            }
            catch (Exception ex)
            {
                // Log the error but don't fail the operation
                // In a production system, you would use proper logging here
                Console.WriteLine($"Warning: Could not delete uploaded video file {filePath}: {ex.Message}");
            }
        }

        return video.Id;
    }


    public async Task<ExerciseVideoDto> GetVideoAnalysisAsync(int videoId)
    {
        var video = await _context.Get<ExerciseVideo>()
            .Include(v => v.ExerciseType) // Include exercise type for mapping
            .FirstOrDefaultAsync(v => v.Id == videoId);
        return _mapper.Map<ExerciseVideoDto>(video);
    }

    public Task<List<ExerciseTypeDto>> RetrieveExerciseTypes() =>
        _mapper.ProjectTo<ExerciseTypeDto>(_context.Get<ExerciseType>()).ToListAsync();
}