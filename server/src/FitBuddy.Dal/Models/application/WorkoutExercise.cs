using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace FitBuddy.Dal.Models.application;

[Table("workout_exercises")]
public partial class WorkoutExercise
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("workout_id")]
    public int WorkoutId { get; set; }

    [Column("exercise_id")]
    public int ExerciseId { get; set; }

    [Column("order_in_workout")]
    public int OrderInWorkout { get; set; }

    [Column("sets")]
    public int? Sets { get; set; }

    [Column("reps")]
    public int? Reps { get; set; }

    [Column("time_seconds")]
    public int? TimeSeconds { get; set; }

    [Column("rest_seconds")]
    public int? RestSeconds { get; set; }

    [Column("weight_description")]
    [StringLength(100)]
    public string? WeightDescription { get; set; }

    [Column("notes")]
    public string? Notes { get; set; }

    [Column("workout_type_data", TypeName = "jsonb")]
    public JsonDocument? WorkoutTypeData { get; set; }

    [Column("minute_number")]
    public int? MinuteNumber { get; set; }

    [Column("round_number")]
    public int? RoundNumber { get; set; }

    [Column("sequence_position")]
    public int? SequencePosition { get; set; }

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime? CreatedDate { get; set; }

    [ForeignKey("WorkoutId")]
    [InverseProperty("WorkoutExercises")]
    public virtual Workout Workout { get; set; } = null!;

    [ForeignKey("ExerciseId")]
    [InverseProperty("WorkoutExercises")]
    public virtual Exercise Exercise { get; set; } = null!;
}