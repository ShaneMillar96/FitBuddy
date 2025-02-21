using AutoMapper;
using FitBuddy.Dal.Enums;
using FitBuddy.Dal.Extensions;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Dal.Models.application;
using FitBuddy.Dal.Specifications.Workouts;
using FitBuddy.Services.Dtos.Pagination;
using FitBuddy.Services.Dtos.Workouts;
using FitBuddy.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Unosquare.EntityFramework.Specification.Common.Extensions;

namespace FitBuddy.Services.Services;

public class WorkoutService : IWorkoutService
{
    private readonly IFitBudContext _context;
    private readonly IPaginationService _paginationService;
    private readonly IMapper _mapper;
    
    public WorkoutService(IFitBudContext context, IPaginationService paginationService, IMapper mapper)
    {
        (_context, _paginationService, _mapper) = (context, paginationService,  mapper);
    }
    
    public async Task<PaginatedDto<WorkoutDto>> RetrieveWorkouts(PaginationDto pagination)
    {
        var (pageSize, pageNumber, searchQuery, sortBy, ascending) = pagination;
        
        var query = _context
            .Get<Workout>()
            .Include(x => x.CreatedBy)
            .Include(x => x.WorkoutType)
            .Include(x => x.ScoreType)
            .Where(new WorkoutBySearchSpec(searchQuery));

        var workouts = _mapper
            .ProjectTo<WorkoutDto>(query)
            .OrderByDescending(x => x.CreatedDate);

        return await _paginationService.CreatePaginatedResponseAsync(workouts, pageSize, pageNumber);
    }
    
    public async Task<WorkoutDto?> RetrieveWorkout(int id) =>
        await _mapper.ProjectTo<WorkoutDto>(_context
                .Get<Workout>()
                .Where(new WorkoutByIdSpec(id)))
            .SingleOrDefaultAsync();
    
    public async Task<int> CreateWorkout(CreateWorkoutDto workout)
    {
        var newWorkout = _mapper.Map<Workout>(workout);
        newWorkout.ScoreTypeId = ((WorkoutTypes)workout.TypeId) switch
        {
            WorkoutTypes.ForTime or WorkoutTypes.Ladder => 1,
            _ => 2 
        };
        await _context.AddAsync(newWorkout);
        await _context.SaveChangesAsync();

        return newWorkout.Id;
    }
    
    public async Task<bool> UpdateWorkout(int id, UpdateWorkoutDto workout)
    {
        var currentWorkout = _context
            .Get<Workout>()
            .FirstOrDefault(new WorkoutByIdSpec(id));

        if (currentWorkout == null) return false;
        
        _mapper.Map(workout, currentWorkout);
        await _context.SaveChangesAsync();
        return true;
    }
    
    public async Task<bool> DeleteWorkout(int id)
    {
        var workout = _context
            .Get<Workout>()
            .FirstOrDefault(new WorkoutByIdSpec(id));

        if (workout == null) return false;
        
        _context.Delete(workout);
        await _context.SaveChangesAsync();
        return true;
    }
    
    public Task<List<WorkoutTypeDto>> RetrieveWorkoutTypes() =>
        _mapper.ProjectTo<WorkoutTypeDto>(_context.Get<WorkoutType>()).ToListAsync();
    
    public async Task<PaginatedDto<WorkoutResultDto>> RetrieveWorkoutResults(PaginationDto pagination, int workoutId)
    {
        var (pageSize, pageNumber, searchQuery, sortBy, ascending) = pagination;

        var query = _context
            .Get<WorkoutResult>()
            .Include(x => x.Workout)
            .ThenInclude(x => x.WorkoutType)
            .Include(x => x.CreatedBy)
            .Where(new WorkoutResultByWorkoutIdSpec(workoutId));

        var workoutResults = _mapper.ProjectTo<WorkoutResultDto>(query);

        return await _paginationService.CreatePaginatedResponseAsync(workoutResults, pageSize, pageNumber);
    }
    
    public async Task<int> CreateWorkoutResult(CreateWorkoutResultDto result)
    {
        var newResult = _mapper.Map<WorkoutResult>(result); 
        
        await _context.AddAsync(newResult);
        await _context.SaveChangesAsync();

        return newResult.Id;
    }
    
    public async Task<bool> ResultExists(int workoutId)
    {
        var currentUserId = _context.GetCurrentUserId();
        return await _context.Get<WorkoutResult>()
            .AnyAsync(r => r.WorkoutId == workoutId && r.CreatedById == currentUserId);
    }
    
    public async Task<bool> UpdateWorkoutResult(int id, UpdateWorkoutResultDto result)
    {
        var currentResult = _context
            .Get<WorkoutResult>()
            .FirstOrDefault(new WorkoutResultByIdSpec(id));

        if (currentResult == null) return false;

        _mapper.Map(result, currentResult);
        await _context.SaveChangesAsync();
        return true;
    }
}