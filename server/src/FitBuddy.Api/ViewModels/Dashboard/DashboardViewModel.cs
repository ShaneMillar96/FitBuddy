namespace FitBuddy.Api.ViewModels.Dashboard;

public class DashboardViewModel
{
    public int WorkoutsToday { get; set; }
    public int WorkoutsThisWeek { get; set; }
    public int WorkoutsAllTime { get; set; }
    public int TotalComments { get; set; }
    public string? FavoriteWorkoutType { get; set; }
    public BestWorkoutResultViewModel? BestWorkoutResult { get; set; }
    public List<DailyWorkoutCountViewModel> WeeklyWorkoutCounts { get; set; } = new();
}