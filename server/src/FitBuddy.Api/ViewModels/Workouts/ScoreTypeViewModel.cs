namespace FitBuddy.Api.ViewModels.Workouts;

public class ScoreTypeViewModel
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime? CreatedDate { get; set; }
}