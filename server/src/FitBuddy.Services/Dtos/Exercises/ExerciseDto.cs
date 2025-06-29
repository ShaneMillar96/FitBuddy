namespace FitBuddy.Services.Dtos.Exercises;

public class ExerciseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int CategoryId { get; set; }
    public string[] MuscleGroups { get; set; } = Array.Empty<string>();
    public string[] EquipmentNeeded { get; set; } = Array.Empty<string>();
    public string? Description { get; set; }
    public string? Instructions { get; set; }
    public int? DifficultyLevel { get; set; }
    public bool IsCompound { get; set; }
    public string ExerciseType { get; set; } = "strength"; // strength, cardio, bodyweight, time_based, distance_based
    public DateTime? CreatedDate { get; set; }
    public string CategoryName { get; set; } = null!;
}

public class CreateExerciseDto
{
    public string Name { get; set; } = null!;
    public int CategoryId { get; set; }
    public string[] MuscleGroups { get; set; } = Array.Empty<string>();
    public string[] EquipmentNeeded { get; set; } = Array.Empty<string>();
    public string? Description { get; set; }
    public string? Instructions { get; set; }
    public int? DifficultyLevel { get; set; }
    public bool IsCompound { get; set; }
    public string ExerciseType { get; set; } = "strength";
}

public class UpdateExerciseDto
{
    public string Name { get; set; } = null!;
    public int CategoryId { get; set; }
    public string[] MuscleGroups { get; set; } = Array.Empty<string>();
    public string[] EquipmentNeeded { get; set; } = Array.Empty<string>();
    public string? Description { get; set; }
    public string? Instructions { get; set; }
    public int? DifficultyLevel { get; set; }
    public bool IsCompound { get; set; }
    public string ExerciseType { get; set; } = "strength";
}

public class WorkoutExerciseDto
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
    public ExerciseDto Exercise { get; set; } = null!;
}

public class CreateWorkoutExerciseDto
{
    public int ExerciseId { get; set; }
    public int OrderInWorkout { get; set; }
    public int? Sets { get; set; }
    public int? Reps { get; set; }
    public decimal? WeightKg { get; set; }
    public int? DistanceMeters { get; set; }
    public int? DurationSeconds { get; set; }
    public int? RestSeconds { get; set; }
    public string? Notes { get; set; }
}