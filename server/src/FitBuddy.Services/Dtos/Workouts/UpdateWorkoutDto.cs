namespace FitBuddy.Services.Dtos.Workouts;

public class UpdateWorkoutDto
{
    public string Name { get; set; }
    
    public string Description { get; set; }
    
    public int TypeId { get; set; }
}