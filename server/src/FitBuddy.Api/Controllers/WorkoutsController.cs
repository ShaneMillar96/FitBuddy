using AutoMapper;
using FitBuddy.Api.Controllers.Base;
using FitBuddy.Api.RequestModels.Workouts;
using FitBuddy.Api.ViewModels.Pagination;
using FitBuddy.Api.ViewModels.Workouts;
using FitBuddy.Services.Dtos.Pagination;
using FitBuddy.Services.Dtos.Workouts;
using FitBuddy.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FitBuddy.Api.Controllers;

[ApiController]
[Route("workouts")]
public class WorkoutsController : FitBuddyBaseController
{
    private readonly IMapper _mapper;
    private readonly IWorkoutService _service;
    
    public WorkoutsController(IMapper mapper, IWorkoutService service)
    {
        (_mapper, _service) = (mapper, service);
    }
    
    [HttpGet]
    public async Task<ActionResult> GetWorkouts([FromQuery] PaginationDto pagination)
    {
        var workouts = await _service.RetrieveWorkouts(pagination);
        return OkOrNoContent(_mapper.Map<PaginatedViewModel<WorkoutViewModel>>(workouts));
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult> GetWorkout(int id)
    {
        var workout = await _service.RetrieveWorkout(id);
        return OkOrNoContent(_mapper.Map<WorkoutViewModel>(workout));
    }
    
    [HttpPost]
    public async Task<ActionResult> CreateWorkout([FromBody] CreateWorkoutRequestModel workout)
    {
        var badRequest = await Validate(workout);
        if (badRequest != null) return badRequest;
        
        var workoutId = await _service.CreateWorkout(_mapper.Map<CreateWorkoutDto>(workout));
        return Created("Workout created", workoutId);
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateWorkout(int id, [FromBody] UpdateWorkoutRequestModel workout)
    {
        var badRequest = await Validate(workout);
        if (badRequest != null) return badRequest;
        
        var updated = await _service.UpdateWorkout(id, _mapper.Map<UpdateWorkoutDto>(workout));
        if (updated) return Ok();
        return NotFound($"Workout with id {id} not found");
    }
    
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteWorkout(int id)
    {
        var deleted = await _service.DeleteWorkout(id);
        if (deleted) return NoContent();
        return NotFound($"Workout with id {id} not found");
    }
    
    [HttpGet ("types")]
    public async Task<ActionResult> GetWorkoutTypes()
    {
        var workoutTypes = await _service.RetrieveWorkoutTypes();
        return OkOrNoContent(_mapper.Map<List<WorkoutTypeViewModel>>(workoutTypes));
    }
    
    [HttpGet("{id}/results")]
    public async Task<ActionResult> GetWorkoutResults([FromQuery] PaginationDto pagination, int id)
    {
        var workoutResults = await _service.RetrieveWorkoutResults(pagination, id);
        return OkOrNoContent(_mapper.Map<PaginatedViewModel<WorkoutResultViewModel>>(workoutResults));
    }
}