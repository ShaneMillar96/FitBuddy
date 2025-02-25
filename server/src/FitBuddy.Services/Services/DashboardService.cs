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
    
    public async Task<DashboardDto> GetMemberDashboardAsync()
    {
        var today = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified).Date;        var weekStart = today.AddDays(-(int)today.DayOfWeek);
        var memberId = _context.GetCurrentUserId();

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

        return new DashboardDto
        {
            WorkoutsToday = workoutsToday,
            WorkoutsThisWeek = workoutsThisWeek,
            WorkoutsAllTime = workoutsAllTime,
            TotalComments = totalComments,
            FavoriteWorkoutType = favoriteWorkoutType,
            BestWorkoutResult = bestResult,
            WeeklyWorkoutCounts = weeklyWorkoutCounts
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

    private async Task<BestWorkoutResultDto?> GetBestWorkoutResult(int memberId)
    {
        var allResultsQuery = _context.Get<WorkoutResult>()
            .Include(wr => wr.Workout)
            .ThenInclude(w => w.ScoreType)
            .Where(wr => wr.Result != null)
            .AsEnumerable();

        return allResultsQuery
            .GroupBy(wr => new { wr.WorkoutId, wr.Workout.Name, wr.Workout.ScoreTypeId })
            .Select(g => new
            {
                g.Key.WorkoutId,
                g.Key.Name,
                g.Key.ScoreTypeId,
                MemberResult = g.FirstOrDefault(wr => wr.CreatedById == memberId),
                RankedResults = g.OrderBy(wr => wr.Workout.ScoreTypeId == 1 
                    ? wr.Result 
                    : "").ThenByDescending(wr => wr.Workout.ScoreTypeId != 1 
                    ? wr.Result 
                    : "").ToList()
            })
            .Where(x => x.MemberResult != null)
            .Select(x => new BestWorkoutResultDto
            {
                WorkoutId = x.WorkoutId,
                WorkoutName = x.Name,
                Result = x.MemberResult!.Result!,
                Rank = x.RankedResults.IndexOf(x.MemberResult) + 1
            })
            .MinBy(x => x.Rank);
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
}