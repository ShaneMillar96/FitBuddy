using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FitBuddy.Dal.Interfaces;

namespace FitBuddy.Dal.Models.application;

public class WorkoutSession : ICreatedByTracking
{
    [Key]
    public string Id { get; set; } = null!;
    
    [Required]
    public int WorkoutId { get; set; }
    
    [Required]
    public int MemberId { get; set; }
    
    [Required]
    public SessionStatus Status { get; set; }
    
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public DateTime? PausedAt { get; set; }
    public int TotalPausedTimeSeconds { get; set; }
    public int CurrentExerciseIndex { get; set; }
    public string? SessionNotes { get; set; }
    
    // Metadata fields from ICreatedByTracking
    public int CreatedById { get; set; }
    public DateTime CreatedDate { get; set; }
    public int? ModifiedById { get; set; }
    public DateTime? ModifiedDate { get; set; }
    
    // Navigation properties
    public virtual Workout Workout { get; set; } = null!;
    public virtual Member Member { get; set; } = null!;
    public virtual Member CreatedBy { get; set; } = null!;
    public virtual Member? ModifiedBy { get; set; }
    public virtual ICollection<SessionExerciseProgress> ExerciseProgress { get; set; } = new List<SessionExerciseProgress>();
}

public class SessionExerciseProgress
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string SessionId { get; set; } = null!;
    
    [Required]
    public int ExerciseId { get; set; }
    
    [Required]
    public int OrderInWorkout { get; set; }
    
    [Required]
    public ExerciseStatus Status { get; set; }
    
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public int TotalTimeSeconds { get; set; }
    public string? Notes { get; set; }
    
    // Planned values from WorkoutExercise
    public int? PlannedSets { get; set; }
    public int? PlannedReps { get; set; }
    public decimal? PlannedWeightKg { get; set; }
    public int? PlannedDistanceMeters { get; set; }
    public int? PlannedDurationSeconds { get; set; }
    public int? PlannedRestSeconds { get; set; }
    
    // Navigation properties
    public virtual WorkoutSession Session { get; set; } = null!;
    public virtual Exercise Exercise { get; set; } = null!;
    public virtual ICollection<SessionSetProgress> Sets { get; set; } = new List<SessionSetProgress>();
}

public class SessionSetProgress
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int ExerciseProgressId { get; set; }
    
    [Required]
    public int SetNumber { get; set; }
    
    [Required]
    public SetStatus Status { get; set; }
    
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
    
    // Navigation property
    public virtual SessionExerciseProgress ExerciseProgress { get; set; } = null!;
}

public enum SessionStatus
{
    NotStarted = 0,
    Active = 1,
    Paused = 2,
    Completed = 3,
    Abandoned = 4
}

public enum ExerciseStatus
{
    NotStarted = 0,
    InProgress = 1,
    Completed = 2,
    Skipped = 3
}

public enum SetStatus
{
    NotStarted = 0,
    InProgress = 1,
    Completed = 2,
    Skipped = 3
}