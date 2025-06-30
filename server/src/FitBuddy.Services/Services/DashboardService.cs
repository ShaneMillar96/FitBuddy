using FitBuddy.Dal.Interfaces;
using FitBuddy.Dal.Models.application;
using FitBuddy.Services.Dtos.Members;
using FitBuddy.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitBuddy.Services.Services;

public class DashboardService : IDashboardService
{
    private readonly IFitBudContext _context;

    public DashboardService(IFitBudContext context)
    {
        (_context) = (context);
    }
    
    public async Task<DashboardDto> GetMemberDashboardAsync(int memberId)
    {
        var today = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified).Date;       
        var weekStart = today.AddDays(-(int)today.DayOfWeek);

        var workoutResultsQuery = _context.Get<WorkoutResult>()
            .Include(wr => wr.Workout)
            .ThenInclude(w => w.WorkoutType)
            .Include(wr => wr.Workout)
            .ThenInclude(w => w.ScoreType)
            .Where(wr => wr.CreatedById == memberId);

        var (workoutsToday, workoutsThisWeek, workoutsAllTime) = await GetWorkoutCounts(workoutResultsQuery, today, weekStart);
        var totalComments = await GetCommentCount(memberId);

        var favoriteWorkoutType = await GetFavoriteWorkoutType(workoutResultsQuery);

        var bestResult = await GetBestWorkoutResult(memberId);

        var weeklyWorkoutCounts = await GetWeeklyWorkoutCounts(workoutResultsQuery, today);

        // Enhanced stats
        var workoutsCreated = await GetWorkoutsCreatedCount(memberId);
        var favoriteWorkouts = await GetFavoriteWorkoutsCount(memberId);
        var totalMinutesExercised = await GetTotalMinutesExercised(workoutResultsQuery);
        var currentStreak = await GetCurrentStreak(memberId);
        var personalBests = await GetPersonalBestsCount(memberId);
        var categoryBreakdown = await GetCategoryBreakdown(workoutResultsQuery);
        var recentAchievements = await GetRecentAchievements(memberId);
        var trendingMetrics = await GetTrendingMetrics(workoutResultsQuery, today);

        return new DashboardDto
        {
            WorkoutsToday = workoutsToday,
            WorkoutsThisWeek = workoutsThisWeek,
            WorkoutsAllTime = workoutsAllTime,
            TotalComments = totalComments,
            FavoriteWorkoutType = favoriteWorkoutType,
            BestWorkoutResult = bestResult,
            WeeklyWorkoutCounts = weeklyWorkoutCounts,
            
            // Enhanced personal stats
            WorkoutsCreated = workoutsCreated,
            WorkoutsCompleted = workoutsAllTime,
            FavoriteWorkouts = favoriteWorkouts,
            TotalMinutesExercised = totalMinutesExercised,
            CurrentStreak = currentStreak,
            PersonalBests = personalBests,
            
            // Weekly progress (using simple goal of 4 workouts per week)
            WeeklyGoal = 4,
            WeeklyProgress = workoutsThisWeek,
            WeeklyCompletionPercentage = Math.Min(100, (workoutsThisWeek / 4.0) * 100),
            
            // Enhanced data
            CategoryBreakdown = categoryBreakdown,
            RecentAchievements = recentAchievements,
            TrendingMetrics = trendingMetrics
        };
    }

    private async Task<(int today, int thisWeek, int allTime)> GetWorkoutCounts(
        IQueryable<WorkoutResult> workoutResultsQuery, DateTime today, DateTime weekStart)
    {
        var todayCount = await workoutResultsQuery.CountAsync(wr => wr.CreatedDate.Date == today);
        var weekCount = await workoutResultsQuery.CountAsync(wr => wr.CreatedDate.Date >= weekStart);
        var allTimeCount = await workoutResultsQuery.CountAsync();

        return (todayCount, weekCount, allTimeCount);
    }

    private async Task<int> GetCommentCount(int memberId)
    {
        return await _context.Get<Comment>().CountAsync(c => c.CreatedById == memberId);
    }
    
    private async Task<string?> GetFavoriteWorkoutType(IQueryable<WorkoutResult> workoutResultsQuery)
    {
        return await workoutResultsQuery
            .GroupBy(wr => wr.Workout.WorkoutType.Name)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .FirstOrDefaultAsync();
    }

    private Task<BestWorkoutResultDto?> GetBestWorkoutResult(int memberId)
    {
        var allResultsQuery = _context.Get<WorkoutResult>()
            .Include(wr => wr.Workout)
            .ThenInclude(w => w.ScoreType)
            .Where(wr => wr.ResultSummary != null)
            .AsEnumerable();

        var result = allResultsQuery
            .GroupBy(wr => new { wr.WorkoutId, wr.Workout.Name, wr.Workout.ScoreTypeId })
            .Select(g => new
            {
                g.Key.WorkoutId,
                g.Key.Name,
                g.Key.ScoreTypeId,
                MemberResult = g.FirstOrDefault(wr => wr.CreatedById == memberId),
                RankedResults = g.OrderBy(wr => wr.Workout.ScoreTypeId == 1 
                    ? wr.ResultSummary 
                    : "").ThenByDescending(wr => wr.Workout.ScoreTypeId != 1 
                    ? wr.ResultSummary 
                    : "").ToList()
            })
            .Where(x => x.MemberResult != null)
            .Select(x => new BestWorkoutResultDto
            {
                WorkoutId = x.WorkoutId,
                WorkoutName = x.Name,
                Result = x.MemberResult!.ResultSummary!,
                Rank = x.RankedResults.IndexOf(x.MemberResult) + 1
            })
            .MinBy(x => x.Rank);

        return Task.FromResult(result);
    }

    private async Task<List<DailyWorkoutCountDto>> GetWeeklyWorkoutCounts(
        IQueryable<WorkoutResult> workoutResultsQuery, DateTime today)
    {
        var rawCounts = await workoutResultsQuery
            .Where(wr => wr.CreatedDate.Date >= today.AddDays(-6))
            .GroupBy(wr => wr.CreatedDate.Date)
            .Select(g => new DailyWorkoutCountDto
            {
                Date = g.Key,
                Count = g.Count()
            })
            .ToListAsync();

        var allDates = Enumerable.Range(0, 7)
            .Select(d => today.AddDays(-6 + d))
            .ToList();

        return allDates
            .Select(date => rawCounts.FirstOrDefault(wc => wc.Date == date) 
                            ?? new DailyWorkoutCountDto { Date = date, Count = 0 })
            .ToList();
    }

    private async Task<int> GetWorkoutsCreatedCount(int memberId)
    {
        return await _context.Get<Workout>().CountAsync(w => w.CreatedById == memberId);
    }

    private async Task<int> GetFavoriteWorkoutsCount(int memberId)
    {
        return await _context.Get<WorkoutFavorite>()
            .CountAsync(wf => wf.MemberId == memberId);
    }

    private async Task<int> GetTotalMinutesExercised(IQueryable<WorkoutResult> workoutResultsQuery)
    {
        return await workoutResultsQuery
            .Include(wr => wr.Workout)
            .Where(wr => wr.Workout.EstimatedDurationMinutes.HasValue)
            .SumAsync(wr => wr.Workout.EstimatedDurationMinutes!.Value);
    }

    private async Task<int> GetCurrentStreak(int memberId)
    {
        var recentWorkouts = await _context.Get<WorkoutResult>()
            .Where(wr => wr.CreatedById == memberId)
            .OrderByDescending(wr => wr.CreatedDate)
            .Select(wr => wr.CreatedDate.Date)
            .Distinct()
            .Take(30)
            .ToListAsync();

        if (!recentWorkouts.Any()) return 0;

        var today = DateTime.UtcNow.Date;
        var streak = 0;
        var currentDate = today;

        // Check if there's a workout today or yesterday (allowing for flexibility)
        if (!recentWorkouts.Contains(today) && !recentWorkouts.Contains(today.AddDays(-1)))
            return 0;

        // Count consecutive days
        while (recentWorkouts.Contains(currentDate))
        {
            streak++;
            currentDate = currentDate.AddDays(-1);
        }

        return streak;
    }

    private async Task<int> GetPersonalBestsCount(int memberId)
    {
        // Count the number of workouts where the user has the best result
        var allResults = await _context.Get<WorkoutResult>()
            .Include(wr => wr.Workout)
            .ThenInclude(w => w.ScoreType)
            .Where(wr => wr.ResultSummary != null)
            .ToListAsync();

        return allResults
            .GroupBy(wr => wr.WorkoutId)
            .Count(g => g.OrderBy(wr => wr.Workout.ScoreTypeId == 1 ? wr.ResultSummary : "")
                        .ThenByDescending(wr => wr.Workout.ScoreTypeId != 1 ? wr.ResultSummary : "")
                        .First().CreatedById == memberId);
    }

    private async Task<List<CategoryStatsDto>> GetCategoryBreakdown(IQueryable<WorkoutResult> workoutResultsQuery)
    {
        var categoryStats = await workoutResultsQuery
            .Include(wr => wr.Workout)
            .ThenInclude(w => w.Category)
            .Where(wr => wr.Workout.Category != null)
            .GroupBy(wr => new { wr.Workout.Category!.Id, wr.Workout.Category.Name })
            .Select(g => new CategoryStatsDto
            {
                CategoryId = g.Key.Id,
                CategoryName = g.Key.Name,
                WorkoutCount = g.Count(),
                TotalMinutes = g.Sum(wr => wr.Workout.EstimatedDurationMinutes ?? 0),
                Color = "" // Will be set after the query
            })
            .OrderByDescending(cs => cs.WorkoutCount)
            .ToListAsync();

        // Set colors after the query to avoid EF Core translation issues
        var result = categoryStats ?? new List<CategoryStatsDto>();
        foreach (var stat in result)
        {
            stat.Color = GetCategoryColor(stat.CategoryId);
        }

        return result;
    }

    private async Task<List<AchievementDto>> GetRecentAchievements(int memberId)
    {
        // Mock recent achievements - in real app, you'd have an achievements system
        var achievements = new List<AchievementDto>();
        
        var totalWorkouts = await _context.Get<WorkoutResult>().CountAsync(wr => wr.CreatedById == memberId);
        var recentDate = DateTime.UtcNow.AddDays(-7);

        if (totalWorkouts >= 10)
        {
            achievements.Add(new AchievementDto
            {
                Title = "Workout Warrior",
                Description = "Completed 10 workouts",
                AchievedDate = recentDate,
                Icon = "🏆",
                Color = "text-yellow-500"
            });
        }

        if (totalWorkouts >= 50)
        {
            achievements.Add(new AchievementDto
            {
                Title = "Fitness Legend",
                Description = "Completed 50 workouts",
                AchievedDate = recentDate.AddDays(-2),
                Icon = "👑",
                Color = "text-purple-500"
            });
        }

        return achievements.Take(3).ToList();
    }

    private async Task<TrendingMetricsDto> GetTrendingMetrics(IQueryable<WorkoutResult> workoutResultsQuery, DateTime today)
    {
        var thisWeekStart = today.AddDays(-(int)today.DayOfWeek);
        var lastWeekStart = thisWeekStart.AddDays(-7);

        var thisWeekCount = await workoutResultsQuery.CountAsync(wr => wr.CreatedDate.Date >= thisWeekStart);
        var lastWeekCount = await workoutResultsQuery.CountAsync(wr => 
            wr.CreatedDate.Date >= lastWeekStart && wr.CreatedDate.Date < thisWeekStart);

        var workoutFrequencyTrend = lastWeekCount == 0 ? 0 : 
            ((double)(thisWeekCount - lastWeekCount) / lastWeekCount) * 100;

        var avgDuration = await workoutResultsQuery
            .Include(wr => wr.Workout)
            .Where(wr => wr.Workout.EstimatedDurationMinutes.HasValue)
            .AverageAsync(wr => (double?)wr.Workout.EstimatedDurationMinutes) ?? 0;

        var dayOfWeekStats = await workoutResultsQuery
            .GroupBy(wr => wr.CreatedDate.DayOfWeek)
            .Select(g => new { DayOfWeek = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .FirstOrDefaultAsync();

        return new TrendingMetricsDto
        {
            WorkoutFrequencyTrend = workoutFrequencyTrend,
            AverageWorkoutDuration = avgDuration,
            AverageWorkoutDurationTrend = 0, // Could calculate trend if needed
            MostActiveDay = dayOfWeekStats?.DayOfWeek.ToString() ?? "Monday",
            ConsecutiveDaysActive = await GetCurrentStreak(workoutResultsQuery.FirstOrDefault()?.CreatedById ?? 0)
        };
    }

    private string GetCategoryColor(int categoryId)
    {
        return categoryId switch
        {
            1 => "#3B82F6", // Blue for Weight Session
            2 => "#EF4444", // Red for CrossFit WOD
            3 => "#10B981", // Green for Running Intervals
            4 => "#06B6D4", // Cyan for Swimming
            5 => "#F59E0B", // Amber for Hyrox
            6 => "#8B5CF6", // Purple for Stretching
            _ => "#6B7280"  // Gray for unknown
        };
    }
}