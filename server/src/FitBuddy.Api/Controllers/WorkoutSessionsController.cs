using AutoMapper;
using FitBuddy.Api.Controllers.Base;
using FitBuddy.Api.RequestModels.Sessions;
using FitBuddy.Api.ViewModels.Sessions;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Services.Dtos.Sessions;
using FitBuddy.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitBuddy.Api.Controllers;

[Authorize]
[ApiController]
[Route("sessions")]
public class WorkoutSessionsController : FitBuddyBaseController
{
    private readonly IMapper _mapper;
    private readonly IWorkoutSessionService _sessionService;
    
    public WorkoutSessionsController(IMapper mapper, IWorkoutSessionService sessionService, IFitBudContext context) 
        : base(context)
    {
        (_mapper, _sessionService) = (mapper, sessionService);
    }

    [HttpPost("start")]
    public async Task<ActionResult> StartSession([FromBody] CreateWorkoutSessionRequestModel request)
    {
        try
        {
            var sessionDto = _mapper.Map<CreateWorkoutSessionDto>(request);
            var sessionId = await _sessionService.StartSession(sessionDto);
            return Created("Session started", new { SessionId = sessionId });
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized("User not authenticated");
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error starting session: {ex.Message}");
        }
    }

    [HttpGet("{sessionId}")]
    public async Task<ActionResult> GetSession(string sessionId)
    {
        var session = await _sessionService.GetSession(sessionId);
        if (session == null)
            return NotFound($"Session {sessionId} not found");

        return Ok(_mapper.Map<WorkoutSessionViewModel>(session));
    }

    [HttpGet("active")]
    public async Task<ActionResult> GetActiveSession()
    {
        var memberId = GetCurrentUserId();
        var session = await _sessionService.GetActiveMemberSession(memberId);
        if (session == null)
            return NoContent();

        return Ok(_mapper.Map<WorkoutSessionViewModel>(session));
    }

    [HttpGet("history")]
    public async Task<ActionResult> GetMemberSessions([FromQuery] int? workoutId = null)
    {
        var memberId = GetCurrentUserId();
        var sessions = await _sessionService.GetMemberSessions(memberId, workoutId);
        return Ok(_mapper.Map<List<WorkoutSessionViewModel>>(sessions));
    }

    [HttpPut("{sessionId}/pause")]
    public async Task<ActionResult> PauseSession(string sessionId)
    {
        var success = await _sessionService.PauseSession(sessionId);
        if (!success)
            return BadRequest("Unable to pause session. Session may not exist or not be active.");

        return Ok("Session paused");
    }

    [HttpPut("{sessionId}/resume")]
    public async Task<ActionResult> ResumeSession(string sessionId)
    {
        var success = await _sessionService.ResumeSession(sessionId);
        if (!success)
            return BadRequest("Unable to resume session. Session may not exist or not be paused.");

        return Ok("Session resumed");
    }

    [HttpDelete("{sessionId}")]
    public async Task<ActionResult> AbandonSession(string sessionId)
    {
        var success = await _sessionService.AbandonSession(sessionId);
        if (!success)
            return NotFound($"Session {sessionId} not found");

        return Ok("Session abandoned");
    }

    [HttpPost("{sessionId}/complete")]
    public async Task<ActionResult> CompleteSession(string sessionId, [FromBody] CompleteWorkoutSessionRequestModel request)
    {
        try
        {
            var completeDto = _mapper.Map<CompleteWorkoutSessionDto>(request);
            completeDto.SessionId = sessionId;
            
            var resultId = await _sessionService.CompleteSession(completeDto);
            return Ok(new { ResultId = resultId, Message = "Session completed successfully" });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized("Session does not belong to current user");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error completing session: {ex.Message}");
        }
    }

    [HttpPut("{sessionId}/exercises/{exerciseId}/start")]
    public async Task<ActionResult> StartExercise(string sessionId, int exerciseId)
    {
        var success = await _sessionService.StartExercise(sessionId, exerciseId);
        if (!success)
            return BadRequest("Unable to start exercise. Exercise may already be started or not exist.");

        return Ok("Exercise started");
    }

    [HttpPut("{sessionId}/exercises/{exerciseId}/complete")]
    public async Task<ActionResult> CompleteExercise(string sessionId, int exerciseId)
    {
        var success = await _sessionService.CompleteExercise(sessionId, exerciseId);
        if (!success)
            return BadRequest("Unable to complete exercise. Exercise may not exist.");

        return Ok("Exercise completed");
    }

    [HttpPut("{sessionId}/exercises/{exerciseId}/skip")]
    public async Task<ActionResult> SkipExercise(string sessionId, int exerciseId)
    {
        var success = await _sessionService.SkipExercise(sessionId, exerciseId);
        if (!success)
            return BadRequest("Unable to skip exercise. Exercise may not exist.");

        return Ok("Exercise skipped");
    }

    [HttpPut("{sessionId}/exercises/{exerciseId}/progress")]
    public async Task<ActionResult> UpdateExerciseProgress(
        string sessionId, 
        int exerciseId, 
        [FromBody] UpdateSessionExerciseProgressRequestModel request)
    {
        var progressDto = _mapper.Map<UpdateSessionExerciseProgressDto>(request);
        var success = await _sessionService.UpdateExerciseProgress(sessionId, exerciseId, progressDto);
        
        if (!success)
            return BadRequest("Unable to update exercise progress. Exercise may not exist.");

        return Ok("Exercise progress updated");
    }

    [HttpPut("{sessionId}/exercises/{exerciseId}/sets/{setNumber}/start")]
    public async Task<ActionResult> StartSet(string sessionId, int exerciseId, int setNumber)
    {
        var success = await _sessionService.StartSet(sessionId, exerciseId, setNumber);
        if (!success)
            return BadRequest("Unable to start set. Set may already be started or not exist.");

        return Ok("Set started");
    }

    [HttpPut("{sessionId}/exercises/{exerciseId}/sets/{setNumber}/complete")]
    public async Task<ActionResult> CompleteSet(
        string sessionId, 
        int exerciseId, 
        int setNumber, 
        [FromBody] UpdateSessionSetProgressRequestModel request)
    {
        var setDto = _mapper.Map<UpdateSessionSetProgressDto>(request);
        var success = await _sessionService.CompleteSet(sessionId, exerciseId, setNumber, setDto);
        
        if (!success)
            return BadRequest("Unable to complete set. Set may not exist.");

        return Ok("Set completed");
    }

    [HttpPut("{sessionId}/exercises/{exerciseId}/sets/{setNumber}")]
    public async Task<ActionResult> UpdateSetProgress(
        string sessionId, 
        int exerciseId, 
        int setNumber, 
        [FromBody] UpdateSessionSetProgressRequestModel request)
    {
        var setDto = _mapper.Map<UpdateSessionSetProgressDto>(request);
        var success = await _sessionService.UpdateSetProgress(sessionId, exerciseId, setNumber, setDto);
        
        if (!success)
            return BadRequest("Unable to update set progress. Set may not exist.");

        return Ok("Set progress updated");
    }
}