using FitBuddy.Api.Controllers.Base;
using Microsoft.AspNetCore.Mvc;

namespace FitBuddy.Api.Controllers;

[ApiController]
[Route("workouts")]
public class WorkoutsController : FitBuddyBaseController
{
    [HttpGet]
    public ActionResult GetWorkouts()
    {
        return OkOrNoContent(new { Workouts = new[] { "Legs", "Arms", "Back" } });
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
    
    [HttpGet]
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