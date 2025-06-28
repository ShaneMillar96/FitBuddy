using FitBuddy.Services.Dtos.Categories;
using FitBuddy.Services.Dtos.Pagination;

namespace FitBuddy.Services.Interfaces;

public interface ICategoryService
{
    Task<List<WorkoutCategoryDto>> GetAllCategoriesAsync();
    Task<WorkoutCategoryDto?> GetCategoryByIdAsync(int id);
    Task<List<WorkoutSubTypeDto>> GetSubTypesByCategoryAsync(int categoryId);
    Task<WorkoutSubTypeDto?> GetSubTypeByIdAsync(int id);
    Task<int> CreateCategoryAsync(CreateWorkoutCategoryDto dto);
    Task<bool> UpdateCategoryAsync(int id, UpdateWorkoutCategoryDto dto);
    Task<bool> DeleteCategoryAsync(int id);
    Task<PaginatedDto<WorkoutCategoryDto>> GetCategoriesPaginatedAsync(PaginationDto pagination);
}