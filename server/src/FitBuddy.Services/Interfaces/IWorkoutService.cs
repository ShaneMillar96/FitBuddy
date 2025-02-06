namespace FitBuddy.Services.Interfaces;

public interface IWorkoutService
{
    Task<string[]> RetrieveWorkouts();
    Task<string> RetrieveWorkout(int workoutId);
    Task<string> CreateWorkout(string workout);
    Task<string> UpdateWorkout(int workoutId, string workout);
    Task<string> DeleteWorkout(int workoutId);
    Task<string[]> RetrieveWorkoutTypes();
    Task<string[]> RetrieveWorkoutResults(int workoutId);
}