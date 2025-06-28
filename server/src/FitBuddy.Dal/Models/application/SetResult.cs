using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FitBuddy.Dal.Models.application;

[Table("set_results")]
public partial class SetResult
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("exercise_result_id")]
    public int ExerciseResultId { get; set; }

    [Column("set_number")]
    public int SetNumber { get; set; }

    [Column("reps_completed")]
    public int? RepsCompleted { get; set; }

    [Column("weight_used_kg")]
    [Precision(5, 2)]
    public decimal? WeightUsedKg { get; set; }

    [Column("rpe_rating")]
    public int? RpeRating { get; set; }

    [Column("rest_time_seconds")]
    public int? RestTimeSeconds { get; set; }

    [Column("notes")]
    public string? Notes { get; set; }

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime? CreatedDate { get; set; }

    [ForeignKey("ExerciseResultId")]
    [InverseProperty("SetResults")]
    public virtual ExerciseResult ExerciseResult { get; set; } = null!;
}