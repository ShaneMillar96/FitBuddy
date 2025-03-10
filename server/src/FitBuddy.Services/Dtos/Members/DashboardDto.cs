namespace FitBuddy.Services.Dtos.Members;

public class DashboardDto
{
    public int WorkoutsToday { get; set; }
    public int WorkoutsThisWeek { get; set; }
    public int WorkoutsAllTime { get; set; }
    public int TotalComments { get; set; }
    public string? FavoriteWorkoutType { get; set; }
    public BestWorkoutResultDto? BestWorkoutResult { get; set; }
    public List<DailyWorkoutCountDto> WeeklyWorkoutCounts { get; set; } = new();
}