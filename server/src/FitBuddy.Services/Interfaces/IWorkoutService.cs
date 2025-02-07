using FitBuddy.Services.Dtos.Pagination;
using FitBuddy.Services.Dtos.Workouts;

namespace FitBuddy.Services.Interfaces;

public interface IWorkoutService
{
    Task<PaginatedDto<WorkoutDto>> RetrieveWorkouts(PaginationDto pagination);
    Task<WorkoutDto?> RetrieveWorkout(int workoutId);
     Task<int> CreateWorkout(CreateWorkoutDto workout);
     Task<bool> UpdateWorkout(int workoutId, UpdateWorkoutDto workout);
    // Task<string> DeleteWorkout(int workoutId);
    // Task<string[]> RetrieveWorkoutTypes();
    // Task<string[]> RetrieveWorkoutResults(int workoutId);
}