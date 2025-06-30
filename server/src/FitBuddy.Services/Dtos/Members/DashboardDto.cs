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
    
    // Enhanced personal stats
    public int WorkoutsCreated { get; set; }
    public int WorkoutsCompleted { get; set; }
    public int FavoriteWorkouts { get; set; }
    public int TotalMinutesExercised { get; set; }
    public int CurrentStreak { get; set; }
    public int PersonalBests { get; set; }
    
    // Weekly progress tracking
    public int WeeklyGoal { get; set; }
    public int WeeklyProgress { get; set; }
    public double WeeklyCompletionPercentage { get; set; }
    
    // Category breakdown
    public List<CategoryStatsDto> CategoryBreakdown { get; set; } = new();
    
    // Recent achievements
    public List<AchievementDto> RecentAchievements { get; set; } = new();
    
    // Trending metrics
    public TrendingMetricsDto TrendingMetrics { get; set; } = new();
}

public class CategoryStatsDto
{
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int WorkoutCount { get; set; }
    public int TotalMinutes { get; set; }
    public string Color { get; set; } = string.Empty;
}

public class AchievementDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime AchievedDate { get; set; }
    public string Icon { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
}

public class TrendingMetricsDto
{
    public double WorkoutFrequencyTrend { get; set; } // percentage change week over week
    public double AverageWorkoutDuration { get; set; }
    public double AverageWorkoutDurationTrend { get; set; }
    public string MostActiveDay { get; set; } = string.Empty;
    public int ConsecutiveDaysActive { get; set; }
}