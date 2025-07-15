namespace FitBuddy.Api.ViewModels.Exercises;

public class ExerciseViewModel
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? Instructions { get; set; }
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
    public int? TimeSeconds { get; set; }
    public int? RestSeconds { get; set; }
    public string? WeightDescription { get; set; }
    public string? Notes { get; set; }
    public string? WorkoutTypeData { get; set; }
    public int? MinuteNumber { get; set; }
    public int? RoundNumber { get; set; }
    public int? SequencePosition { get; set; }
    public ExerciseViewModel Exercise { get; set; } = null!;
}