using System.ComponentModel.DataAnnotations;

namespace FitBuddy.Api.RequestModels.Exercises;

public class CreateExerciseRequestModel
{
    [Required]
    [StringLength(200, MinimumLength = 2)]
    public string Name { get; set; } = null!;

    [Required]
    public int CategoryId { get; set; }

    public string[] MuscleGroups { get; set; } = Array.Empty<string>();
    public string[] EquipmentNeeded { get; set; } = Array.Empty<string>();

    [StringLength(1000)]
    public string? Description { get; set; }

    [StringLength(2000)]
    public string? Instructions { get; set; }

    [Range(1, 5)]
    public int? DifficultyLevel { get; set; }

    public bool IsCompound { get; set; }
    
    [StringLength(20)]
    public string ExerciseType { get; set; } = "strength";
}

public class UpdateExerciseRequestModel
{
    [Required]
    [StringLength(200, MinimumLength = 2)]
    public string Name { get; set; } = null!;

    [Required]
    public int CategoryId { get; set; }

    public string[] MuscleGroups { get; set; } = Array.Empty<string>();
    public string[] EquipmentNeeded { get; set; } = Array.Empty<string>();

    [StringLength(1000)]
    public string? Description { get; set; }

    [StringLength(2000)]
    public string? Instructions { get; set; }

    [Range(1, 5)]
    public int? DifficultyLevel { get; set; }

    public bool IsCompound { get; set; }
    
    [StringLength(20)]
    public string ExerciseType { get; set; } = "strength";
}

public class CreateWorkoutExerciseRequestModel
{
    [Required]
    public int ExerciseId { get; set; }

    [Required]
    public int OrderInWorkout { get; set; }

    [Range(1, 100)]
    public int? Sets { get; set; }

    [Range(1, 10000)]
    public int? Reps { get; set; }

    [Range(0.1, 1000)]
    public decimal? WeightKg { get; set; }

    [Range(1, 100000)]
    public int? DistanceMeters { get; set; }

    [Range(1, 86400)]
    public int? DurationSeconds { get; set; }

    [Range(0, 600)]
    public int? RestSeconds { get; set; }

    [StringLength(500)]
    public string? Notes { get; set; }
}