using AutoMapper;
using FitBuddy.Api.Controllers.Base;
using FitBuddy.Api.ViewModels.Analysis;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitBuddy.Api.Controllers;

[ApiController]
[Route("analysis")]
[Authorize]
public class AnalysisController : FitBuddyBaseController
{
    private readonly IMapper _mapper;
    private readonly IAnalysisService _service;
    private readonly IFitBudContext _context;

    public AnalysisController(IMapper mapper, IAnalysisService service, IFitBudContext context)
        : base(context)
    {
        _mapper = mapper;
        _service = service;
        _context = context;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadVideo(IFormFile videoFile, [FromForm] int exerciseTypeId)
    {
        if (videoFile == null)
            return BadRequest("Video file is required.");

        // // Validate exerciseTypeId against exercise_types table
        // var exerciseTypeExists = await _context.Get<ExerciseType>()
        //     .AnyAsync(et => et.Id == exerciseTypeId);
        //
        // if (!exerciseTypeExists)
        //     return BadRequest($"Invalid exercise type ID: {exerciseTypeId}");

        var memberId = GetCurrentUserId();
        var videoId = await _service.UploadAndAnalyzeVideoAsync(memberId, videoFile, exerciseTypeId);
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

    [HttpGet("types")]
    public async Task<ActionResult> GetExerciseTypes()
    {
        var exerciseTypes = await _service.RetrieveExerciseTypes();
        return OkOrNoContent(_mapper.Map<List<ExerciseTypeViewModel>>(exerciseTypes));
    }
}
