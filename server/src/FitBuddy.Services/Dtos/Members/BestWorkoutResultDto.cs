namespace FitBuddy.Services.Dtos.Members;

public class BestWorkoutResultDto
{
    public int WorkoutId { get; set; }
    public string WorkoutName { get; set; } = string.Empty;
    public int Rank { get; set; }
    public string Result { get; set; } = string.Empty;
}