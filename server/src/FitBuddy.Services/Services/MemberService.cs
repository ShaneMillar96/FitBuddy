using AutoMapper;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Dal.Models.application;
using FitBuddy.Dal.Specifications.Members;
using FitBuddy.Services.Dtos.Members;
using FitBuddy.Services.Dtos.Pagination;
using FitBuddy.Services.Interfaces;
using FitBuddy.Dal.Extensions;
using Microsoft.EntityFrameworkCore;


using Unosquare.EntityFramework.Specification.Common.Extensions;

namespace FitBuddy.Services.Services;

public class MemberService : IMemberService
{
    private readonly IFitBudContext _context;
    private readonly IPaginationService _paginationService;
    private readonly IMapper _mapper;
    
    public MemberService(IFitBudContext context, IPaginationService paginationService, IMapper mapper)
    {
        (_context, _paginationService, _mapper) = (context, paginationService,  mapper);
    }
    
    public async Task<PaginatedDto<MemberDto>> RetrieveMembers(PaginationDto pagination)
    {
        var (pageSize, pageNumber, searchQuery, sortBy, ascending) = pagination;
        
        var query = _context
            .Get<Member>()
            .Where(new MemberBySearchSpec(searchQuery));

        var members = _mapper
            .ProjectTo<MemberDto>(query)
            .OrderBy(sortBy, ascending);

        return await _paginationService.CreatePaginatedResponseAsync(members, pageSize, pageNumber);
    }
    
    public async Task<MemberDto?> RetrieveMember(int id) =>
        await _mapper.ProjectTo<MemberDto>(_context
                .Get<Member>()
                .Where(new MemberByIdSpec(id)))
            .SingleOrDefaultAsync();
  
    
    public async Task<int> CreateMember(CreateMemberDto member)
    {
        var newMember = _mapper.Map<Member>(member); 
        await _context.AddAsync(newMember);
        await _context.SaveChangesAsync();

        return newMember.Id;
    }
    
    public async Task<bool> UpdateMember(int id, UpdateMemberDto member)
    {
        var currentMember = _context
            .Get<Member>()
            .FirstOrDefault(new MemberByIdSpec(id));

        if (currentMember == null) return false;
        
        _mapper.Map(member, currentMember);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteMember(int id)
    {
        var currentMember = _context
            .Get<Member>()
            .FirstOrDefault(new MemberByIdSpec(id));
        
        if (currentMember == null) return false;
        _context.Delete(currentMember);
        await _context.SaveChangesAsync();
        return true;
    }
    
  public async Task<DashboardDto> GetMemberDashboardAsync()
    {
        var today = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified).Date;
        var weekStart = today.AddDays(-(int)today.DayOfWeek);
        var memberId = _context.GetCurrentUserId();

        // Workouts stats
        var workoutResultsQuery = _context.Get<WorkoutResult>()
            .Include(wr => wr.Workout)
            .ThenInclude(w => w.WorkoutType)
            .Include(wr => wr.Workout)
            .ThenInclude(w => w.ScoreType)
            .Where(wr => wr.CreatedById == memberId);

        var workoutsToday = await workoutResultsQuery
            .CountAsync(wr => wr.CreatedDate.Date == today);
        var workoutsThisWeek = await workoutResultsQuery
            .CountAsync(wr => wr.CreatedDate.Date >= weekStart);
        var workoutsAllTime = await workoutResultsQuery.CountAsync();

        // Total comments
        var totalComments = await _context.Get<Comment>()
            .CountAsync(c => c.CreatedById == memberId);

        // Favorite workout type
        var favoriteWorkoutType = await workoutResultsQuery
            .GroupBy(wr => wr.Workout.WorkoutType.Name)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .FirstOrDefaultAsync();

        // Best leaderboard result
        var allResultsQuery = _context.Get<WorkoutResult>()
            .Include(wr => wr.Workout)
            .ThenInclude(w => w.ScoreType)
            .Where(wr => wr.Result != null)
            .AsEnumerable(); // Switch to client-side evaluation

        var bestResult = allResultsQuery
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
            .OrderBy(x => x.Rank)
            .FirstOrDefault();


        // Weekly workout counts (last 7 days)
        var weeklyCounts = await workoutResultsQuery
            .Where(wr => wr.CreatedDate.Date >= today.AddDays(-6))
            .GroupBy(wr => wr.CreatedDate.Date)
            .Select(g => new DailyWorkoutCountDto
            {
                Date = g.Key,
                Count = g.Count()
            })
            .ToListAsync();

        // Fill missing days with zero counts
        var allDates = Enumerable.Range(0, 7).Select(d => today.AddDays(-6 + d)).ToList();
        var filledWeeklyCounts = allDates.Select(date => weeklyCounts.FirstOrDefault(wc => wc.Date == date) ?? new DailyWorkoutCountDto { Date = date, Count = 0 }).ToList();

        return new DashboardDto
        {
            WorkoutsToday = workoutsToday,
            WorkoutsThisWeek = workoutsThisWeek,
            WorkoutsAllTime = workoutsAllTime,
            TotalComments = totalComments,
            FavoriteWorkoutType = favoriteWorkoutType,
            BestWorkoutResult = bestResult,
            WeeklyWorkoutCounts = filledWeeklyCounts
        };
    }
}