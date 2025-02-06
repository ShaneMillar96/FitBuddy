using AutoMapper;
using FitBuddy.Api.Controllers.Base;
using FitBuddy.Api.ViewModels.Pagination;
using FitBuddy.Api.ViewModels.Workouts;
using FitBuddy.Services.Dtos.Pagination;
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
    public ActionResult GetWorkout(int id)
    {
        return OkOrNoContent(new { Workout = "Legs" });
    }
    
    [HttpPost]
    public ActionResult CreateWorkout([FromBody] string workout)
    {
        return Created("Workout created", workout);
    }
    
    [HttpPut("{id}")]
    public ActionResult UpdateWorkout(int id, [FromBody] string workout)
    {
        return Ok(workout);
    }
    
    [HttpDelete("{id}")]
    public ActionResult DeleteWorkout(int id)
    {
        return NoContent();
    }
    
    [HttpGet ("types")]
    public ActionResult GetWorkoutTypes()
    {
        return OkOrNoContent(new { WorkoutTypes = new[] { "EMOM", "AMRAP", "TABATA" } });
    }
    
    [HttpGet("{id}/results")]
    public ActionResult GetWorkoutResults(int id)
    {
        return OkOrNoContent(new { Results = new[] { "10 reps", "20 reps", "30 reps" } });
    }
}