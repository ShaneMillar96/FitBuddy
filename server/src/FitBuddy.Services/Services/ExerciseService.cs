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

        // MuscleGroups and EquipmentNeeded filters removed for CrossFit simplification

        query = query.OrderBy(e => e.Name);

        var paginatedResult = await query.PaginateAsync(pagination, entity => new ExerciseDto
        {
            Id = entity.Id,
            Name = entity.Name,
            CategoryId = entity.CategoryId,
            CategoryName = entity.Category.Name,
            Description = entity.Description,
            Instructions = entity.Instructions,
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
            Description = exercise.Description,
            Instructions = exercise.Instructions,
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
            Description = e.Description,
            Instructions = e.Instructions,
            CreatedDate = e.CreatedDate
        }).ToList();
    }

    public async Task<List<ExerciseDto>> SearchExercisesAsync(string searchTerm, int? categoryId = null)
    {
        var query = _context.Get<Exercise>()
            .Include(e => e.Category)
            .Where(e => e.Name.ToLower().Contains(searchTerm.ToLower()) ||
                       (e.Description != null && e.Description.ToLower().Contains(searchTerm.ToLower())));

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
            Description = e.Description,
            Instructions = e.Instructions,
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

    // GetMuscleGroupsAsync and GetEquipmentTypesAsync removed for CrossFit simplification

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
            Description = e.Description,
            Instructions = e.Instructions,
            CreatedDate = e.CreatedDate
        }).ToList();
    }

    private IQueryable<Exercise> ApplySubTypeFiltering(IQueryable<Exercise> query, int categoryId, string subTypeName)
    {
        // Simplified for CrossFit only - return all CrossFit exercises
        return query;
    }

    // Removed unused filtering methods for CrossFit simplification
}