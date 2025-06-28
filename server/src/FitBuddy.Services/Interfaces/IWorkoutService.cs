using FitBuddy.Services.Dtos.Pagination;
using FitBuddy.Services.Dtos.Workouts;

namespace FitBuddy.Services.Interfaces;

public interface IWorkoutService
{
    Task<PaginatedDto<WorkoutDto>> RetrieveWorkouts(PaginationDto pagination, int? categoryId = null, int? subTypeId = null, int? difficultyLevel = null);
    Task<WorkoutDto?> RetrieveWorkout(int workoutId);
    Task<int> CreateWorkout(CreateWorkoutDto workout);
    Task<bool> UpdateWorkout(int workoutId, UpdateWorkoutDto workout);
    Task<bool> DeleteWorkout(int workoutId);
    Task<List<WorkoutTypeDto>> RetrieveWorkoutTypes();
    Task<PaginatedDto<WorkoutResultDto>> RetrieveWorkoutResults(PaginationDto pagination, int workoutId);
    Task<int> CreateWorkoutResult(CreateWorkoutResultDto result);
    Task<bool> ResultExists(int workoutId);
    Task<bool> UpdateWorkoutResult(int id, UpdateWorkoutResultDto result);
}