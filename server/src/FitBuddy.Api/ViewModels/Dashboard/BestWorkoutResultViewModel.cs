namespace FitBuddy.Api.ViewModels.Dashboard;

public class BestWorkoutResultViewModel
{
    public int WorkoutId { get; set; }
    public string WorkoutName { get; set; } = string.Empty;
    public int Rank { get; set; }
    public string Result { get; set; } = string.Empty;
}