namespace FitBuddy.Services.Dtos.Workouts;

public class CreateWorkoutResultDto
{
    public int WorkoutId { get; set; }
    public string Result { get; set; }
    public int? Duration { get; set; }
    public int? AvgHeartRate { get; set; }
    public int? CaloriesBurned { get; set; }
}