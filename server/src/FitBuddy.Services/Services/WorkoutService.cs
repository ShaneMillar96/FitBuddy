using System.Net.Http.Headers;
using System.Text.Json;
using AutoMapper;
using FitBuddy.Services.Dtos.Exercises;
using FitBuddy.Dal.Enums;
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
        _context = context;
        _paginationService = paginationService;
        _mapper = mapper;
    }
    
    public async Task<PaginatedDto<WorkoutDto>> RetrieveWorkouts(PaginationDto pagination, int? subTypeId = null, int? minDuration = null, int? maxDuration = null)
    {
        var (pageSize, pageNumber, searchQuery, sortBy, ascending) = pagination;

        var query = _context
            .Get<Workout>()
            .Include(x => x.CreatedBy)
            .Include(x => x.WorkoutType)
            .Include(x => x.ScoreType)
            .Where(new WorkoutBySearchSpec(searchQuery));

        var workouts = _mapper.ProjectTo<WorkoutDto>(query);

        return await _paginationService.CreatePaginatedResponseAsync(workouts, pageSize, pageNumber);
    }
    
    public async Task<WorkoutDto?> RetrieveWorkout(int id) =>
        await _mapper.ProjectTo<WorkoutDto>(_context
                .Get<Workout>()
                .Include(w => w.WorkoutExercises)
                .ThenInclude(we => we.Exercise)
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

        // Process workout exercises
        if (workout.Exercises?.Any() == true)
        {
            await ProcessWorkoutExercises(newWorkout.Id, workout.Exercises, workout.WorkoutTypeData, workout.TypeId);
        }

        return newWorkout.Id;
    }
    
    private async Task ProcessWorkoutExercises(int workoutId, List<CreateWorkoutExerciseDto> exercises, string? workoutTypeData, int typeId)
    {
        var workoutExercises = new List<WorkoutExercise>();
        
        // Handle dynamic workout types with specific data transformation
        if (!string.IsNullOrEmpty(workoutTypeData) && IsWorkoutTypeWithSpecificData(typeId))
        {
            workoutExercises = TransformWorkoutTypeDataToExercises(workoutId, workoutTypeData, typeId);
        }
        else
        {
            // Handle legacy workout types - direct mapping
            workoutExercises = exercises.Select(e => _mapper.Map<WorkoutExercise>(e)).ToList();
            foreach (var exercise in workoutExercises)
            {
                exercise.WorkoutId = workoutId;
            }
        }
        
        _context.Add(workoutExercises.ToArray());
        await _context.SaveChangesAsync();
    }
    
    private bool IsWorkoutTypeWithSpecificData(int typeId)
    {
        return typeId >= 1 && typeId <= 5; // EMOM, AMRAP, For Time, Tabata, Ladder
    }
    
    private List<WorkoutExercise> TransformWorkoutTypeDataToExercises(int workoutId, string workoutTypeData, int typeId)
    {
        var workoutExercises = new List<WorkoutExercise>();
        
        try
        {
            var jsonDocument = JsonDocument.Parse(workoutTypeData);
            var root = jsonDocument.RootElement;
            
            if (root.TryGetProperty("exercises", out var exercisesElement))
            {
                foreach (var exerciseElement in exercisesElement.EnumerateArray())
                {
                    var workoutExercise = new WorkoutExercise
                    {
                        WorkoutId = workoutId,
                        ExerciseId = exerciseElement.GetProperty("exerciseId").GetInt32(),
                        OrderInWorkout = exerciseElement.GetProperty("orderInWorkout").GetInt32(),
                        WorkoutTypeData = exerciseElement.GetRawText()
                    };
                    
                    // Set basic properties if available
                    if (exerciseElement.TryGetProperty("weightDescription", out var weightDesc))
                        workoutExercise.WeightDescription = weightDesc.GetString();
                    if (exerciseElement.TryGetProperty("notes", out var notes))
                        workoutExercise.Notes = notes.GetString();
                    if (exerciseElement.TryGetProperty("reps", out var reps))
                        workoutExercise.Reps = reps.GetInt32();
                    
                    // Set workout-type specific fields based on type
                    switch (typeId)
                    {
                        case 1: // EMOM
                            if (exerciseElement.TryGetProperty("roundPosition", out var roundPos))
                                workoutExercise.SequencePosition = roundPos.GetInt32();
                            // For EMOM, minute_number would be calculated based on round pattern
                            break;
                            
                        case 2: // AMRAP
                            if (exerciseElement.TryGetProperty("roundPosition", out var amrapRoundPos))
                                workoutExercise.SequencePosition = amrapRoundPos.GetInt32();
                            workoutExercise.RoundNumber = 1; // AMRAP is one round pattern
                            break;
                            
                        case 3: // For Time
                            if (exerciseElement.TryGetProperty("rounds", out var forTimeRounds))
                                workoutExercise.RoundNumber = forTimeRounds.GetInt32();
                            workoutExercise.SequencePosition = workoutExercise.OrderInWorkout;
                            break;
                            
                        case 4: // Tabata
                            if (exerciseElement.TryGetProperty("exercisePosition", out var tabataPos))
                                workoutExercise.SequencePosition = tabataPos.GetInt32();
                            if (exerciseElement.TryGetProperty("workTimeSeconds", out var workTime))
                                workoutExercise.TimeSeconds = workTime.GetInt32();
                            if (exerciseElement.TryGetProperty("restTimeSeconds", out var restTime))
                                workoutExercise.RestSeconds = restTime.GetInt32();
                            break;
                            
                        case 5: // Ladder
                            if (exerciseElement.TryGetProperty("ladderPosition", out var ladderPos))
                                workoutExercise.SequencePosition = ladderPos.GetInt32();
                            break;
                    }
                    
                    workoutExercise.CreatedDate = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified);
                    workoutExercises.Add(workoutExercise);
                }
            }
        }
        catch (Exception ex)
        {
            // Log error and fall back to simple mapping
            Console.WriteLine($"Error processing workout type data: {ex.Message}");
        }
        
        return workoutExercises;
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

    public Task<List<ScoreTypeDto>> RetrieveScoreTypes() =>
        _mapper.ProjectTo<ScoreTypeDto>(_context.Get<ScoreType>()).ToListAsync();

    
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