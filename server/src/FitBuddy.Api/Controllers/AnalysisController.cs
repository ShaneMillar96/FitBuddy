using AutoMapper;
using FitBuddy.Api.Controllers.Base;
using FitBuddy.Api.ViewModels.Analysis;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitBuddy.Api.Controllers;

[ApiController]
[Route("analysis")]
[Authorize]
public class AnalysisController : FitBuddyBaseController
{
    private readonly IMapper _mapper;
    private readonly IAnalysisService _service;

    public AnalysisController(IMapper mapper, IAnalysisService service, IFitBudContext context)
        : base(context)
    {
        _mapper = mapper;
        _service = service;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadVideo(IFormFile videoFile, [FromForm] string exerciseType)
    {
        if (videoFile == null || string.IsNullOrEmpty(exerciseType))
            return BadRequest("Video file and exercise type are required.");

        var memberId = GetCurrentUserId();
        var videoId = await _service.UploadAndAnalyzeVideoAsync(memberId, videoFile, exerciseType);
        return Ok(new { VideoId = videoId });
    }

    [HttpGet("{videoId}")]
    public async Task<IActionResult> GetVideoAnalysis(int videoId)
    {
        var analysis = await _service.GetVideoAnalysisAsync(videoId);
        if (analysis == null || analysis.MemberId != GetCurrentUserId())
            return NotFound($"Video with ID {videoId} not found or not accessible.");
        return Ok(_mapper.Map<ExerciseVideoViewModel>(analysis));
    }
}