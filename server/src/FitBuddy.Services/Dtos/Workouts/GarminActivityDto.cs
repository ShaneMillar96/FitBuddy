namespace FitBuddy.Services.Dtos.Workouts;

public class GarminActivityDto
{
    public string ActivityId { get; set; }
    public string Name { get; set; }
    public int Duration { get; set; }
    public int AvgHeartRate { get; set; } 
    public int CaloriesBurned { get; set; }
    public DateTime StartTime { get; set; }
}