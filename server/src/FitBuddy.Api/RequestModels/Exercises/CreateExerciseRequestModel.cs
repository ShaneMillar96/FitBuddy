using System.ComponentModel.DataAnnotations;

namespace FitBuddy.Api.RequestModels.Exercises;

public class CreateExerciseRequestModel
{
    [Required]
    [StringLength(200, MinimumLength = 2)]
    public string Name { get; set; } = null!;

    [Required]
    public int CategoryId { get; set; }

    [StringLength(1000)]
    public string? Description { get; set; }

    [StringLength(2000)]
    public string? Instructions { get; set; }
}

public class UpdateExerciseRequestModel
{
    [Required]
    [StringLength(200, MinimumLength = 2)]
    public string Name { get; set; } = null!;

    [Required]
    public int CategoryId { get; set; }

    [StringLength(1000)]
    public string? Description { get; set; }

    [StringLength(2000)]
    public string? Instructions { get; set; }
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

    [Range(1, 86400)]
    public int? TimeSeconds { get; set; }

    [Range(0, 600)]
    public int? RestSeconds { get; set; }

    [StringLength(500)]
    public string? Notes { get; set; }
}