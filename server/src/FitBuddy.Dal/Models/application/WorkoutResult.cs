using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FitBuddy.Dal.Interfaces;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace FitBuddy.Dal.Models.application;

[Table("workout_results")]
public partial class WorkoutResult : ICreatedByTracking
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("workout_id")]
    public int WorkoutId { get; set; }

    [Column("created_by_id")]
    public int CreatedById { get; set; }

    // Renamed from "result" to be more descriptive
    [Column("result_summary")]
    public string? ResultSummary { get; set; }

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime CreatedDate { get; set; }

    [Column("modified_date", TypeName = "timestamp without time zone")]
    public DateTime? ModifiedDate { get; set; }

    // Existing Garmin fields
    [Column("duration")]
    public int? Duration { get; set; }

    [Column("avg_heart_rate")]
    public int? AvgHeartRate { get; set; }

    [Column("calories_burned")]
    public int? CaloriesBurned { get; set; }

    [Column("garmin_activity_id")]
    [StringLength(50)]
    public string? GarminActivityId { get; set; }

    // New comprehensive metrics
    [Column("completion_time_seconds")]
    public int? CompletionTimeSeconds { get; set; }

    [Column("difficulty_rating")]
    public int? DifficultyRating { get; set; }

    [Column("energy_level_before")]
    public int? EnergyLevelBefore { get; set; }

    [Column("energy_level_after")]
    public int? EnergyLevelAfter { get; set; }

    [Column("workout_rating")]
    public int? WorkoutRating { get; set; }

    [Column("rpe_rating")]
    public int? RpeRating { get; set; }

    [Column("mood_before")]
    [StringLength(50)]
    public string? MoodBefore { get; set; }

    [Column("mood_after")]
    [StringLength(50)]
    public string? MoodAfter { get; set; }

    [Column("notes")]
    public string? Notes { get; set; }

    [Column("category_metrics", TypeName = "jsonb")]
    public JsonDocument? CategoryMetrics { get; set; }

    [Column("is_personal_record")]
    public bool IsPersonalRecord { get; set; }

    [Column("previous_best_result")]
    public string? PreviousBestResult { get; set; }

    [Column("improvement_percentage")]
    [Precision(5, 2)]
    public decimal? ImprovementPercentage { get; set; }

    [Column("external_workout_id")]
    [StringLength(100)]
    public string? ExternalWorkoutId { get; set; }

    [Column("sync_source")]
    [StringLength(50)]
    public string? SyncSource { get; set; }

    [Column("weather_conditions")]
    [StringLength(100)]
    public string? WeatherConditions { get; set; }

    [Column("location_name")]
    [StringLength(200)]
    public string? LocationName { get; set; }

    [ForeignKey("CreatedById")]
    [InverseProperty("WorkoutResults")]
    public virtual Member CreatedBy { get; set; } = null!;

    [ForeignKey("WorkoutId")]
    [InverseProperty("WorkoutResults")]
    public virtual Workout Workout { get; set; } = null!;

    [InverseProperty("WorkoutResult")]
    public virtual ICollection<ExerciseResult> ExerciseResults { get; set; } = new List<ExerciseResult>();

    [InverseProperty("WorkoutResult")]
    public virtual ICollection<WorkoutAchievement> Achievements { get; set; } = new List<WorkoutAchievement>();
}
