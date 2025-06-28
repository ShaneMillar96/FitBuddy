namespace FitBuddy.Api.ViewModels.Exercises;

public class ExerciseViewModel
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = null!;
    public string[] MuscleGroups { get; set; } = Array.Empty<string>();
    public string[] EquipmentNeeded { get; set; } = Array.Empty<string>();
    public string? Description { get; set; }
    public string? Instructions { get; set; }
    public int? DifficultyLevel { get; set; }
    public bool IsCompound { get; set; }
    public DateTime? CreatedDate { get; set; }
}

public class WorkoutExerciseViewModel
{
    public int Id { get; set; }
    public int WorkoutId { get; set; }
    public int ExerciseId { get; set; }
    public int OrderInWorkout { get; set; }
    public int? Sets { get; set; }
    public int? Reps { get; set; }
    public decimal? WeightKg { get; set; }
    public int? DistanceMeters { get; set; }
    public int? DurationSeconds { get; set; }
    public int? RestSeconds { get; set; }
    public string? Notes { get; set; }
    public ExerciseViewModel Exercise { get; set; } = null!;
}