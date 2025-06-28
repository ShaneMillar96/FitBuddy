using FitBuddy.Services.Dtos.Exercises;
using System.Text.Json;

namespace FitBuddy.Services.Dtos.Workouts;

public class CreateWorkoutDto
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public int TypeId { get; set; }
    
    // Enhanced fields
    public int? CategoryId { get; set; }
    public int? SubTypeId { get; set; }
    public int? DifficultyLevel { get; set; }
    public int? EstimatedDurationMinutes { get; set; }
    public string[] EquipmentNeeded { get; set; } = Array.Empty<string>();
    public JsonDocument? WorkoutStructure { get; set; }
    public List<CreateWorkoutExerciseDto> Exercises { get; set; } = new();
}