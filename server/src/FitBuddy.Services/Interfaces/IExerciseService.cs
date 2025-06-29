using FitBuddy.Services.Dtos.Exercises;
using FitBuddy.Services.Dtos.Pagination;

namespace FitBuddy.Services.Interfaces;

public interface IExerciseService
{
    Task<PaginatedDto<ExerciseDto>> GetExercisesAsync(PaginationDto pagination, int? categoryId = null, string? muscleGroup = null, string? equipment = null);
    Task<ExerciseDto?> GetExerciseByIdAsync(int id);
    Task<List<ExerciseDto>> GetExercisesByCategoryAsync(int categoryId);
    Task<List<ExerciseDto>> SearchExercisesAsync(string searchTerm, int? categoryId = null);
    Task<int> CreateExerciseAsync(CreateExerciseDto dto);
    Task<bool> UpdateExerciseAsync(int id, UpdateExerciseDto dto);
    Task<bool> DeleteExerciseAsync(int id);
    Task<List<string>> GetMuscleGroupsAsync();
    Task<List<string>> GetEquipmentTypesAsync();
    Task<List<ExerciseDto>> GetExercisesByCategoryAndSubTypeAsync(int categoryId, string? subTypeName = null);
}