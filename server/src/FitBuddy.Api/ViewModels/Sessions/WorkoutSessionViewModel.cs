using FitBuddy.Api.ViewModels.Workouts;

namespace FitBuddy.Api.ViewModels.Sessions;

public class WorkoutSessionViewModel
{
    public string Id { get; set; } = null!;
    public int WorkoutId { get; set; }
    public int MemberId { get; set; }
    public string Status { get; set; } = null!; // NotStarted, Active, Paused, Completed, Abandoned
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public DateTime? PausedAt { get; set; }
    public int TotalPausedTimeSeconds { get; set; }
    public int CurrentExerciseIndex { get; set; }
    public string? SessionNotes { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }
    
    // Navigation properties
    public WorkoutViewModel? Workout { get; set; }
    public List<SessionExerciseProgressViewModel> ExerciseProgress { get; set; } = new();
}

public class SessionExerciseProgressViewModel
{
    public int Id { get; set; }
    public string SessionId { get; set; } = null!;
    public int ExerciseId { get; set; }
    public int OrderInWorkout { get; set; }
    public string Status { get; set; } = null!; // NotStarted, InProgress, Completed, Skipped
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public int TotalTimeSeconds { get; set; }
    public string? Notes { get; set; }
    
    // Planned values
    public int? PlannedSets { get; set; }
    public int? PlannedReps { get; set; }
    public decimal? PlannedWeightKg { get; set; }
    public int? PlannedDistanceMeters { get; set; }
    public int? PlannedDurationSeconds { get; set; }
    public int? PlannedRestSeconds { get; set; }
    
    // Navigation properties
    public string ExerciseName { get; set; } = null!;
    public List<SessionSetProgressViewModel> Sets { get; set; } = new();
}

public class SessionSetProgressViewModel
{
    public int Id { get; set; }
    public int ExerciseProgressId { get; set; }
    public int SetNumber { get; set; }
    public string Status { get; set; } = null!; // NotStarted, InProgress, Completed, Skipped
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    
    // Actual achieved values
    public int? ActualReps { get; set; }
    public decimal? ActualWeightKg { get; set; }
    public int? ActualDistanceMeters { get; set; }
    public int? ActualDurationSeconds { get; set; }
    
    // Rest period tracking
    public DateTime? RestStartTime { get; set; }
    public DateTime? RestEndTime { get; set; }
    public int? ActualRestSeconds { get; set; }
    
    public string? Notes { get; set; }
    public int? RPE { get; set; } // Rate of Perceived Exertion (1-10)
}