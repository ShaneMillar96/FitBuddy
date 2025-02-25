namespace FitBuddy.Api.RequestModels.Workouts;

public class CreateWorkoutResultRequestModel
{
    public int WorkoutId { get; set; }
    public string Result { get; set; }
    public int? Duration { get; set; }
    public int? AvgHeartRate { get; set; }
    public int? CaloriesBurned { get; set; }
    public string? GarminActivityId { get; set; }
}