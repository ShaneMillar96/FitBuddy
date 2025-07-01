using FitBuddy.Services.Dtos.Workouts;

namespace FitBuddy.Services.Dtos.Sessions;

public class WorkoutSessionDto
{
    public string Id { get; set; } = null!;
    public int WorkoutId { get; set; }
    public int MemberId { get; set; }
    public SessionStatusDto Status { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public DateTime? PausedAt { get; set; }
    public int TotalPausedTimeSeconds { get; set; }
    public int CurrentExerciseIndex { get; set; }
    public string? SessionNotes { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }
    
    // Navigation properties
    public WorkoutDto? Workout { get; set; }
    public List<SessionExerciseProgressDto> ExerciseProgress { get; set; } = new();
}

public class SessionExerciseProgressDto
{
    public int Id { get; set; }
    public string SessionId { get; set; } = null!;
    public int ExerciseId { get; set; }
    public int OrderInWorkout { get; set; }
    public ExerciseStatusDto Status { get; set; }
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
    public List<SessionSetProgressDto> Sets { get; set; } = new();
}

public class SessionSetProgressDto
{
    public int Id { get; set; }
    public int ExerciseProgressId { get; set; }
    public int SetNumber { get; set; }
    public SetStatusDto Status { get; set; }
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
    public int? RPE { get; set; }
}

public class CreateWorkoutSessionDto
{
    public string Id { get; set; } = null!;
    public int WorkoutId { get; set; }
    public List<CreateSessionExerciseProgressDto> ExerciseProgress { get; set; } = new();
}

public class CreateSessionExerciseProgressDto
{
    public int ExerciseId { get; set; }
    public int OrderInWorkout { get; set; }
    public int? PlannedSets { get; set; }
    public int? PlannedReps { get; set; }
    public decimal? PlannedWeightKg { get; set; }
    public int? PlannedDistanceMeters { get; set; }
    public int? PlannedDurationSeconds { get; set; }
    public int? PlannedRestSeconds { get; set; }
}

public class UpdateSessionExerciseProgressDto
{
    public ExerciseStatusDto Status { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public string? Notes { get; set; }
}

public class UpdateSessionSetProgressDto
{
    public SetStatusDto Status { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public int? ActualReps { get; set; }
    public decimal? ActualWeightKg { get; set; }
    public int? ActualDistanceMeters { get; set; }
    public int? ActualDurationSeconds { get; set; }
    public DateTime? RestStartTime { get; set; }
    public DateTime? RestEndTime { get; set; }
    public int? ActualRestSeconds { get; set; }
    public string? Notes { get; set; }
    public int? RPE { get; set; }
}

public class CompleteWorkoutSessionDto
{
    public string SessionId { get; set; } = null!;
    public int Rating { get; set; } // 1-5 stars
    public string? Mood { get; set; } // terrible, bad, okay, good, amazing
    public string? EnergyLevel { get; set; } // very_low, low, medium, high, very_high
    public string? Notes { get; set; }
    public bool IsPublic { get; set; } = true;
}

public enum SessionStatusDto
{
    NotStarted = 0,
    Active = 1,
    Paused = 2,
    Completed = 3,
    Abandoned = 4
}

public enum ExerciseStatusDto
{
    NotStarted = 0,
    InProgress = 1,
    Completed = 2,
    Skipped = 3
}

public enum SetStatusDto
{
    NotStarted = 0,
    InProgress = 1,
    Completed = 2,
    Skipped = 3
}