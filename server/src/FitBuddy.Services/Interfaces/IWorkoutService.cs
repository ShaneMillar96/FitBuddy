using FitBuddy.Services.Dtos.Pagination;
using FitBuddy.Services.Dtos.Workouts;

namespace FitBuddy.Services.Interfaces;

public interface IWorkoutService
{
    Task<PaginatedDto<WorkoutDto>> RetrieveWorkouts(PaginationDto pagination);
    // Task<string> RetrieveWorkout(int workoutId);
    // Task<string> CreateWorkout(string workout);
    // Task<string> UpdateWorkout(int workoutId, string workout);
    // Task<string> DeleteWorkout(int workoutId);
    // Task<string[]> RetrieveWorkoutTypes();
    // Task<string[]> RetrieveWorkoutResults(int workoutId);
}