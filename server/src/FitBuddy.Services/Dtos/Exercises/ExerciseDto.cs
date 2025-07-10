namespace FitBuddy.Services.Dtos.Exercises;

public class ExerciseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int CategoryId { get; set; }
    public string? Description { get; set; }
    public string? Instructions { get; set; }
    public DateTime? CreatedDate { get; set; }
    public string CategoryName { get; set; } = null!;
}

public class CreateExerciseDto
{
    public string Name { get; set; } = null!;
    public int CategoryId { get; set; }
    public string? Description { get; set; }
    public string? Instructions { get; set; }
}

public class UpdateExerciseDto
{
    public string Name { get; set; } = null!;
    public int CategoryId { get; set; }
    public string? Description { get; set; }
    public string? Instructions { get; set; }
}

public class WorkoutExerciseDto
{
    public int Id { get; set; }
    public int WorkoutId { get; set; }
    public int ExerciseId { get; set; }
    public int OrderInWorkout { get; set; }
    public int? Sets { get; set; }
    public int? Reps { get; set; }
    public int? TimeSeconds { get; set; }
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
    public int? TimeSeconds { get; set; }
    public int? RestSeconds { get; set; }
    public string? Notes { get; set; }
}