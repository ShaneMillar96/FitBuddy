using AutoMapper;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Dal.Models.application;
using FitBuddy.Services.Dtos.Workouts;
using FitBuddy.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitBuddy.Services.Services;

public class WorkoutFavoriteService : IWorkoutFavoriteService
{
    private readonly IFitBudContext _context;
    private readonly IMapper _mapper;

    public WorkoutFavoriteService(IFitBudContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ToggleFavoriteResultDto> ToggleFavoriteAsync(int memberId, int workoutId)
    {
        // Check if the favorite already exists
        var existingFavorite = await _context.Get<WorkoutFavorite>()
            .FirstOrDefaultAsync(wf => wf.MemberId == memberId && wf.WorkoutId == workoutId);

        bool isFavorited;

        if (existingFavorite != null)
        {
            // Remove the favorite
            _context.Delete(existingFavorite);
            isFavorited = false;
        }
        else
        {
            // Add the favorite
            var newFavorite = new WorkoutFavorite
            {
                MemberId = memberId,
                WorkoutId = workoutId,
                CreatedDate = DateTime.UtcNow
            };
            
            await _context.AddAsync(newFavorite);
            isFavorited = true;
        }

        await _context.SaveChangesAsync();

        // Get the total favorites count for this workout
        var totalFavorites = await GetFavoriteCountAsync(workoutId);

        return new ToggleFavoriteResultDto
        {
            IsFavorited = isFavorited,
            TotalFavorites = totalFavorites
        };
    }

    public async Task<bool> IsFavoriteAsync(int memberId, int workoutId)
    {
        return await _context.Get<WorkoutFavorite>()
            .AnyAsync(wf => wf.MemberId == memberId && wf.WorkoutId == workoutId);
    }

    public async Task<List<WorkoutFavoriteDto>> GetMemberFavoritesAsync(int memberId)
    {
        var favorites = await _context.Get<WorkoutFavorite>()
            .Include(wf => wf.Workout)
            .ThenInclude(w => w.WorkoutType)
            .Include(wf => wf.Workout)
            .ThenInclude(w => w.Category)
            .Include(wf => wf.Workout)
            .ThenInclude(w => w.CreatedBy)
            .Where(wf => wf.MemberId == memberId)
            .OrderByDescending(wf => wf.CreatedDate)
            .ToListAsync();

        return _mapper.Map<List<WorkoutFavoriteDto>>(favorites);
    }

    public async Task<int> GetFavoriteCountAsync(int workoutId)
    {
        return await _context.Get<WorkoutFavorite>()
            .CountAsync(wf => wf.WorkoutId == workoutId);
    }

    public async Task<int> GetMemberFavoriteCountAsync(int memberId)
    {
        return await _context.Get<WorkoutFavorite>()
            .CountAsync(wf => wf.MemberId == memberId);
    }
}