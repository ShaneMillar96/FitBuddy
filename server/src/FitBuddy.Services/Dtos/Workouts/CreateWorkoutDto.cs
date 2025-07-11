using FitBuddy.Services.Dtos.Exercises;

namespace FitBuddy.Services.Dtos.Workouts;

public class CreateWorkoutDto
{
    public string Name { get; set; } = null!;
    public int TypeId { get; set; }
    
    // CrossFit-specific fields
    public int? ScoreTypeId { get; set; }
    public int? DifficultyLevel { get; set; }
    public int? EstimatedDurationMinutes { get; set; }
    public List<CreateWorkoutExerciseDto> Exercises { get; set; } = new();
}