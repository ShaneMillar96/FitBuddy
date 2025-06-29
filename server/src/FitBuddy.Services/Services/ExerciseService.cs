using AutoMapper;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Dal.Models.application;
using FitBuddy.Services.Dtos.Exercises;
using FitBuddy.Services.Dtos.Pagination;
using FitBuddy.Services.Extensions;
using FitBuddy.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitBuddy.Services.Services;

public class ExerciseService : IExerciseService
{
    private readonly IFitBudContext _context;
    private readonly IMapper _mapper;

    public ExerciseService(IFitBudContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedDto<ExerciseDto>> GetExercisesAsync(PaginationDto pagination, int? categoryId = null, string? muscleGroup = null, string? equipment = null)
    {
        var query = _context.Get<Exercise>()
            .Include(e => e.Category)
            .AsQueryable();

        if (categoryId.HasValue)
        {
            query = query.Where(e => e.CategoryId == categoryId.Value);
        }

        if (!string.IsNullOrEmpty(muscleGroup))
        {
            query = query.Where(e => e.MuscleGroups.Contains(muscleGroup));
        }

        if (!string.IsNullOrEmpty(equipment))
        {
            query = query.Where(e => e.EquipmentNeeded.Contains(equipment));
        }

        query = query.OrderBy(e => e.Name);

        var paginatedResult = await query.PaginateAsync(pagination, entity => new ExerciseDto
        {
            Id = entity.Id,
            Name = entity.Name,
            CategoryId = entity.CategoryId,
            CategoryName = entity.Category.Name,
            MuscleGroups = entity.MuscleGroups,
            EquipmentNeeded = entity.EquipmentNeeded,
            Description = entity.Description,
            Instructions = entity.Instructions,
            DifficultyLevel = entity.DifficultyLevel,
            IsCompound = entity.IsCompound,
            ExerciseType = entity.ExerciseType,
            CreatedDate = entity.CreatedDate
        });

        return paginatedResult;
    }

    public async Task<ExerciseDto?> GetExerciseByIdAsync(int id)
    {
        var exercise = await _context.Get<Exercise>()
            .Include(e => e.Category)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (exercise == null) return null;

        return new ExerciseDto
        {
            Id = exercise.Id,
            Name = exercise.Name,
            CategoryId = exercise.CategoryId,
            CategoryName = exercise.Category.Name,
            MuscleGroups = exercise.MuscleGroups,
            EquipmentNeeded = exercise.EquipmentNeeded,
            Description = exercise.Description,
            Instructions = exercise.Instructions,
            DifficultyLevel = exercise.DifficultyLevel,
            IsCompound = exercise.IsCompound,
            ExerciseType = exercise.ExerciseType,
            CreatedDate = exercise.CreatedDate
        };
    }

    public async Task<List<ExerciseDto>> GetExercisesByCategoryAsync(int categoryId)
    {
        var exercises = await _context.Get<Exercise>()
            .Include(e => e.Category)
            .Where(e => e.CategoryId == categoryId)
            .OrderBy(e => e.Name)
            .ToListAsync();

        return exercises.Select(e => new ExerciseDto
        {
            Id = e.Id,
            Name = e.Name,
            CategoryId = e.CategoryId,
            CategoryName = e.Category.Name,
            MuscleGroups = e.MuscleGroups,
            EquipmentNeeded = e.EquipmentNeeded,
            Description = e.Description,
            Instructions = e.Instructions,
            DifficultyLevel = e.DifficultyLevel,
            IsCompound = e.IsCompound,
            ExerciseType = e.ExerciseType,
            CreatedDate = e.CreatedDate
        }).ToList();
    }

    public async Task<List<ExerciseDto>> SearchExercisesAsync(string searchTerm, int? categoryId = null)
    {
        var query = _context.Get<Exercise>()
            .Include(e => e.Category)
            .Where(e => e.Name.ToLower().Contains(searchTerm.ToLower()) ||
                       (e.Description != null && e.Description.ToLower().Contains(searchTerm.ToLower())) ||
                       e.MuscleGroups.Any(mg => mg.ToLower().Contains(searchTerm.ToLower())));

        if (categoryId.HasValue)
        {
            query = query.Where(e => e.CategoryId == categoryId.Value);
        }

        var exercises = await query
            .OrderBy(e => e.Name)
            .Take(50) // Limit search results
            .ToListAsync();

        return exercises.Select(e => new ExerciseDto
        {
            Id = e.Id,
            Name = e.Name,
            CategoryId = e.CategoryId,
            CategoryName = e.Category.Name,
            MuscleGroups = e.MuscleGroups,
            EquipmentNeeded = e.EquipmentNeeded,
            Description = e.Description,
            Instructions = e.Instructions,
            DifficultyLevel = e.DifficultyLevel,
            IsCompound = e.IsCompound,
            ExerciseType = e.ExerciseType,
            CreatedDate = e.CreatedDate
        }).ToList();
    }

    public async Task<int> CreateExerciseAsync(CreateExerciseDto dto)
    {
        var exercise = _mapper.Map<Exercise>(dto);
        exercise.CreatedDate = DateTime.UtcNow;

        _context.Add(exercise);
        await _context.SaveChangesAsync();

        return exercise.Id;
    }

    public async Task<bool> UpdateExerciseAsync(int id, UpdateExerciseDto dto)
    {
        var exercise = await _context.Get<Exercise>().Where(x => x.Id == id).FirstOrDefaultAsync();
        if (exercise == null) return false;

        _mapper.Map(dto, exercise);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteExerciseAsync(int id)
    {
        var exercise = await _context.Get<Exercise>().Where(x => x.Id == id).FirstOrDefaultAsync();
        if (exercise == null) return false;

        // Check if exercise is being used in workouts
        var hasWorkoutExercises = await _context.Get<WorkoutExercise>().AnyAsync(we => we.ExerciseId == id);
        if (hasWorkoutExercises) return false; // Cannot delete exercise in use

        _context.Delete(exercise);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<List<string>> GetMuscleGroupsAsync()
    {
        var muscleGroups = await _context.Get<Exercise>()
            .SelectMany(e => e.MuscleGroups)
            .Distinct()
            .OrderBy(mg => mg)
            .ToListAsync();

        return muscleGroups;
    }

    public async Task<List<string>> GetEquipmentTypesAsync()
    {
        var equipmentTypes = await _context.Get<Exercise>()
            .SelectMany(e => e.EquipmentNeeded)
            .Distinct()
            .OrderBy(et => et)
            .ToListAsync();

        return equipmentTypes;
    }

    public async Task<List<ExerciseDto>> GetExercisesByCategoryAndSubTypeAsync(int categoryId, string? subTypeName = null)
    {
        var query = _context.Get<Exercise>()
            .Include(e => e.Category)
            .Where(e => e.CategoryId == categoryId);

        // Apply intelligent filtering based on category and subtype
        if (!string.IsNullOrEmpty(subTypeName))
        {
            query = ApplySubTypeFiltering(query, categoryId, subTypeName);
        }

        var exercises = await query
            .OrderBy(e => e.Name)
            .ToListAsync();

        return exercises.Select(e => new ExerciseDto
        {
            Id = e.Id,
            Name = e.Name,
            CategoryId = e.CategoryId,
            CategoryName = e.Category.Name,
            MuscleGroups = e.MuscleGroups,
            EquipmentNeeded = e.EquipmentNeeded,
            Description = e.Description,
            Instructions = e.Instructions,
            DifficultyLevel = e.DifficultyLevel,
            IsCompound = e.IsCompound,
            ExerciseType = e.ExerciseType,
            CreatedDate = e.CreatedDate
        }).ToList();
    }

    private IQueryable<Exercise> ApplySubTypeFiltering(IQueryable<Exercise> query, int categoryId, string subTypeName)
    {
        return categoryId switch
        {
            1 => ApplyWeightSessionFiltering(query, subTypeName), // Weight Session
            2 => ApplyCrossFitFiltering(query, subTypeName),     // CrossFit WOD
            3 => ApplyRunningFiltering(query, subTypeName),      // Running Intervals
            4 => ApplySwimmingFiltering(query, subTypeName),     // Swimming
            5 => ApplyHyroxFiltering(query, subTypeName),        // Hyrox
            6 => ApplyStretchingFiltering(query, subTypeName),   // Stretching
            _ => query
        };
    }

    private IQueryable<Exercise> ApplyWeightSessionFiltering(IQueryable<Exercise> query, string subTypeName)
    {
        return subTypeName.ToLower() switch
        {
            "push" => query.Where(e => e.MuscleGroups.Any(mg => mg.Contains("chest") || mg.Contains("triceps") || mg.Contains("shoulders"))),
            "pull" => query.Where(e => e.MuscleGroups.Any(mg => mg.Contains("back") || mg.Contains("lats") || mg.Contains("biceps") || mg.Contains("rhomboids"))),
            "legs" => query.Where(e => e.MuscleGroups.Any(mg => mg.Contains("quadriceps") || mg.Contains("hamstrings") || mg.Contains("glutes") || mg.Contains("calves") || mg.Contains("legs"))),
            "upper body" => query.Where(e => e.MuscleGroups.Any(mg => mg.Contains("chest") || mg.Contains("back") || mg.Contains("shoulders") || mg.Contains("triceps") || mg.Contains("biceps") || mg.Contains("lats"))),
            "full body" => query.Where(e => e.IsCompound || e.MuscleGroups.Contains("full body")),
            "powerlifting" => query.Where(e => e.Name.Contains("Deadlift") || e.Name.Contains("Squat") || e.Name.Contains("Bench Press")),
            _ => query
        };
    }

    private IQueryable<Exercise> ApplyCrossFitFiltering(IQueryable<Exercise> query, string subTypeName)
    {
        return subTypeName.ToLower() switch
        {
            "emom" or "amrap" or "for time" => query.Where(e => e.ExerciseType == "bodyweight" || e.ExerciseType == "strength" || e.ExerciseType == "cardio"),
            "tabata" => query.Where(e => e.ExerciseType == "bodyweight" || e.ExerciseType == "cardio"),
            "ladder" => query.Where(e => e.ExerciseType == "bodyweight" || e.ExerciseType == "strength"),
            "chipper" => query.Where(e => e.IsCompound || e.ExerciseType == "bodyweight"),
            _ => query
        };
    }

    private IQueryable<Exercise> ApplyRunningFiltering(IQueryable<Exercise> query, string subTypeName)
    {
        return subTypeName.ToLower() switch
        {
            "track intervals" => query.Where(e => e.ExerciseType == "distance_based" && (e.Name.Contains("Sprint") || e.Name.Contains("Repeat") || e.Name.Contains("Interval"))),
            "tempo run" => query.Where(e => e.ExerciseType == "distance_based" && e.Name.Contains("Tempo")),
            "fartlek" => query.Where(e => e.ExerciseType == "time_based" && e.Name.Contains("Fartlek")),
            "hill repeats" => query.Where(e => e.Name.Contains("Hill")),
            "long run" => query.Where(e => e.ExerciseType == "distance_based" && (e.Name.Contains("5km") || e.Name.Contains("10km"))),
            "recovery run" => query.Where(e => e.ExerciseType == "time_based" || e.ExerciseType == "distance_based"),
            _ => query.Where(e => e.ExerciseType == "distance_based" || e.ExerciseType == "time_based")
        };
    }

    private IQueryable<Exercise> ApplySwimmingFiltering(IQueryable<Exercise> query, string subTypeName)
    {
        return subTypeName.ToLower() switch
        {
            "freestyle" => query.Where(e => e.Name.Contains("Freestyle")),
            "backstroke" => query.Where(e => e.Name.Contains("Backstroke")),
            "breaststroke" => query.Where(e => e.Name.Contains("Breaststroke")),
            "butterfly" => query.Where(e => e.Name.Contains("Butterfly")),
            "individual medley" => query.Where(e => e.Name.Contains("Individual Medley")),
            "open water" => query, // All swimming exercises are suitable for open water
            _ => query
        };
    }

    private IQueryable<Exercise> ApplyHyroxFiltering(IQueryable<Exercise> query, string subTypeName)
    {
        return subTypeName.ToLower() switch
        {
            "full simulation" => query, // All Hyrox exercises
            "strength stations" => query.Where(e => e.ExerciseType == "strength" && (e.Name.Contains("Sled") || e.Name.Contains("Farmers") || e.Name.Contains("Sandbag") || e.Name.Contains("Wall Ball"))),
            "running focus" => query.Where(e => e.ExerciseType == "distance_based" && e.Name.Contains("Run")),
            "station practice" => query.Where(e => e.Name.Contains("Rowing") || e.Name.Contains("Ski") || e.Name.Contains("Sled") || e.Name.Contains("Burpee") || e.Name.Contains("Farmers") || e.Name.Contains("Sandbag") || e.Name.Contains("Wall Ball")),
            "transition training" => query.Where(e => e.ExerciseType == "cardio" || e.ExerciseType == "bodyweight"),
            _ => query
        };
    }

    private IQueryable<Exercise> ApplyStretchingFiltering(IQueryable<Exercise> query, string subTypeName)
    {
        return subTypeName.ToLower() switch
        {
            "dynamic warm-up" => query.Where(e => e.Name.Contains("Dynamic") || e.Name.Contains("Warm")),
            "static stretching" => query.Where(e => e.Name.Contains("Stretch") && !e.Name.Contains("Dynamic")),
            "yoga flow" => query.Where(e => e.Name.Contains("Yoga") || e.Name.Contains("Flow") || e.Name.Contains("Pose")),
            "foam rolling" => query.Where(e => e.Name.Contains("Foam")),
            "mobility work" => query.Where(e => e.ExerciseType == "time_based"),
            "cool down" => query.Where(e => e.Name.Contains("Stretch") || e.Name.Contains("Cool")),
            _ => query
        };
    }
}