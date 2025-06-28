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
}