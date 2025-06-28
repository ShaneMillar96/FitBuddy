using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FitBuddy.Dal.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitBuddy.Dal.Models.application;

[Table("exercise_results")]
public partial class ExerciseResult : ICreatedByTracking
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("workout_result_id")]
    public int WorkoutResultId { get; set; }

    [Column("exercise_id")]
    public int ExerciseId { get; set; }

    [Column("order_completed")]
    public int OrderCompleted { get; set; }

    [Column("sets_completed")]
    public int? SetsCompleted { get; set; }

    [Column("reps_completed")]
    public int? RepsCompleted { get; set; }

    [Column("weight_used_kg")]
    [Precision(5, 2)]
    public decimal? WeightUsedKg { get; set; }

    [Column("distance_completed_meters")]
    public int? DistanceCompletedMeters { get; set; }

    [Column("time_taken_seconds")]
    public int? TimeTakenSeconds { get; set; }

    [Column("rest_time_seconds")]
    public int? RestTimeSeconds { get; set; }

    [Column("notes")]
    public string? Notes { get; set; }

    [Column("is_personal_record")]
    public bool IsPersonalRecord { get; set; }

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime CreatedDate { get; set; }

    [Column("created_by_id")]
    public int CreatedById { get; set; }

    [ForeignKey("WorkoutResultId")]
    [InverseProperty("ExerciseResults")]
    public virtual WorkoutResult WorkoutResult { get; set; } = null!;

    [ForeignKey("ExerciseId")]
    [InverseProperty("ExerciseResults")]
    public virtual Exercise Exercise { get; set; } = null!;

    [ForeignKey("CreatedById")]
    [InverseProperty("ExerciseResults")]
    public virtual Member CreatedBy { get; set; } = null!;

    [InverseProperty("ExerciseResult")]
    public virtual ICollection<SetResult> SetResults { get; set; } = new List<SetResult>();
}