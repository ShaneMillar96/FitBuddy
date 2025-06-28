using System.Text.Json;

namespace FitBuddy.Services.Dtos.Results;

public class EnhancedWorkoutResultDto
{
    public int Id { get; set; }
    public int WorkoutId { get; set; }
    public int CreatedById { get; set; }
    public string? ResultSummary { get; set; }
    public DateTime CreatedDate { get; set; }
    
    // Timing and performance
    public int? CompletionTimeSeconds { get; set; }
    public int? Duration { get; set; }
    
    // Subjective metrics
    public int? DifficultyRating { get; set; }
    public int? EnergyLevelBefore { get; set; }
    public int? EnergyLevelAfter { get; set; }
    public int? WorkoutRating { get; set; }
    public int? RpeRating { get; set; }
    public string? MoodBefore { get; set; }
    public string? MoodAfter { get; set; }
    public string? Notes { get; set; }
    
    // Health metrics
    public int? AvgHeartRate { get; set; }
    public int? CaloriesBurned { get; set; }
    
    // Performance tracking
    public bool IsPersonalRecord { get; set; }
    public string? PreviousBestResult { get; set; }
    public decimal? ImprovementPercentage { get; set; }
    
    // Category-specific metrics
    public JsonDocument? CategoryMetrics { get; set; }
    
    // External integration
    public string? ExternalWorkoutId { get; set; }
    public string? SyncSource { get; set; }
    public string? WeatherConditions { get; set; }
    public string? LocationName { get; set; }
    public string? GarminActivityId { get; set; }
    
    // Related data
    public List<ExerciseResultDto> ExerciseResults { get; set; } = new();
    public string WorkoutName { get; set; } = null!;
    public string MemberName { get; set; } = null!;
}

public class CreateEnhancedWorkoutResultDto
{
    public int WorkoutId { get; set; }
    public string? ResultSummary { get; set; }
    
    // Timing and performance
    public int? CompletionTimeSeconds { get; set; }
    public int? Duration { get; set; }
    
    // Subjective metrics
    public int? DifficultyRating { get; set; }
    public int? EnergyLevelBefore { get; set; }
    public int? EnergyLevelAfter { get; set; }
    public int? WorkoutRating { get; set; }
    public int? RpeRating { get; set; }
    public string? MoodBefore { get; set; }
    public string? MoodAfter { get; set; }
    public string? Notes { get; set; }
    
    // Health metrics
    public int? AvgHeartRate { get; set; }
    public int? CaloriesBurned { get; set; }
    
    // Category-specific metrics
    public JsonDocument? CategoryMetrics { get; set; }
    
    // External integration
    public string? ExternalWorkoutId { get; set; }
    public string? SyncSource { get; set; }
    public string? WeatherConditions { get; set; }
    public string? LocationName { get; set; }
    public string? GarminActivityId { get; set; }
    
    // Exercise results
    public List<CreateExerciseResultDto> ExerciseResults { get; set; } = new();
}

public class ExerciseResultDto
{
    public int Id { get; set; }
    public int WorkoutResultId { get; set; }
    public int ExerciseId { get; set; }
    public int OrderCompleted { get; set; }
    public int? SetsCompleted { get; set; }
    public int? RepsCompleted { get; set; }
    public decimal? WeightUsedKg { get; set; }
    public int? DistanceCompletedMeters { get; set; }
    public int? TimeTakenSeconds { get; set; }
    public int? RestTimeSeconds { get; set; }
    public string? Notes { get; set; }
    public bool IsPersonalRecord { get; set; }
    public DateTime CreatedDate { get; set; }
    public string ExerciseName { get; set; } = null!;
    public List<SetResultDto> SetResults { get; set; } = new();
}

public class CreateExerciseResultDto
{
    public int ExerciseId { get; set; }
    public int OrderCompleted { get; set; }
    public int? SetsCompleted { get; set; }
    public int? RepsCompleted { get; set; }
    public decimal? WeightUsedKg { get; set; }
    public int? DistanceCompletedMeters { get; set; }
    public int? TimeTakenSeconds { get; set; }
    public int? RestTimeSeconds { get; set; }
    public string? Notes { get; set; }
    public List<CreateSetResultDto> SetResults { get; set; } = new();
}

public class SetResultDto
{
    public int Id { get; set; }
    public int ExerciseResultId { get; set; }
    public int SetNumber { get; set; }
    public int? RepsCompleted { get; set; }
    public decimal? WeightUsedKg { get; set; }
    public int? RpeRating { get; set; }
    public int? RestTimeSeconds { get; set; }
    public string? Notes { get; set; }
    public DateTime? CreatedDate { get; set; }
}

public class CreateSetResultDto
{
    public int SetNumber { get; set; }
    public int? RepsCompleted { get; set; }
    public decimal? WeightUsedKg { get; set; }
    public int? RpeRating { get; set; }
    public int? RestTimeSeconds { get; set; }
    public string? Notes { get; set; }
}