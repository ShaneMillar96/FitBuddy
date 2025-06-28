using AutoMapper;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Dal.Models.application;
using FitBuddy.Services.Dtos.Categories;
using FitBuddy.Services.Dtos.Pagination;
using FitBuddy.Services.Extensions;
using FitBuddy.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitBuddy.Services.Services;

public class CategoryService : ICategoryService
{
    private readonly IFitBudContext _context;
    private readonly IMapper _mapper;

    public CategoryService(IFitBudContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<WorkoutCategoryDto>> GetAllCategoriesAsync()
    {
        var categories = await _context.Get<WorkoutCategory>()
            .Include(c => c.SubTypes)
            .OrderBy(c => c.Name)
            .ToListAsync();

        return _mapper.Map<List<WorkoutCategoryDto>>(categories);
    }

    public async Task<WorkoutCategoryDto?> GetCategoryByIdAsync(int id)
    {
        var category = await _context.Get<WorkoutCategory>()
            .Include(c => c.SubTypes)
            .FirstOrDefaultAsync(c => c.Id == id);

        return category == null ? null : _mapper.Map<WorkoutCategoryDto>(category);
    }

    public async Task<List<WorkoutSubTypeDto>> GetSubTypesByCategoryAsync(int categoryId)
    {
        var subTypes = await _context.Get<WorkoutSubType>()
            .Where(st => st.CategoryId == categoryId)
            .OrderBy(st => st.Name)
            .ToListAsync();

        return _mapper.Map<List<WorkoutSubTypeDto>>(subTypes);
    }

    public async Task<WorkoutSubTypeDto?> GetSubTypeByIdAsync(int id)
    {
        var subType = await _context.Get<WorkoutSubType>()
            .FirstOrDefaultAsync(st => st.Id == id);

        return subType == null ? null : _mapper.Map<WorkoutSubTypeDto>(subType);
    }

    public async Task<int> CreateCategoryAsync(CreateWorkoutCategoryDto dto)
    {
        var category = _mapper.Map<WorkoutCategory>(dto);
        category.CreatedDate = DateTime.UtcNow;

        _context.Add(category);
        await _context.SaveChangesAsync();

        return category.Id;
    }

    public async Task<bool> UpdateCategoryAsync(int id, UpdateWorkoutCategoryDto dto)
    {
        var category = await _context.Get<WorkoutCategory>().Where(x => x.Id == id).FirstOrDefaultAsync();
        if (category == null) return false;

        _mapper.Map(dto, category);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteCategoryAsync(int id)
    {
        var category = await _context.Get<WorkoutCategory>().Where(x => x.Id == id).FirstOrDefaultAsync();
        if (category == null) return false;

        // Check if category is being used
        var hasWorkouts = await _context.Get<Workout>().AnyAsync(w => w.CategoryId == id);
        if (hasWorkouts) return false; // Cannot delete category with associated workouts

        _context.Delete(category);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<PaginatedDto<WorkoutCategoryDto>> GetCategoriesPaginatedAsync(PaginationDto pagination)
    {
        var query = _context.Get<WorkoutCategory>()
            .Include(c => c.SubTypes)
            .AsQueryable();

        var paginatedResult = await query.PaginateAsync(pagination, _mapper.Map<WorkoutCategoryDto>);
        return paginatedResult;
    }
}