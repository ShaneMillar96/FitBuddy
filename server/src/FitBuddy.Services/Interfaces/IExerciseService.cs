using FitBuddy.Services.Dtos.Exercises;

namespace FitBuddy.Services.Interfaces;

public interface IExerciseService
{
    Task<List<ExerciseDto>> RetrieveExercises();
    Task<ExerciseDto?> RetrieveExercise(int exerciseId);
    Task<List<ExerciseDto>> SearchExercises(string searchTerm);
}