using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitBuddy.Dal.Models.application;

[Table("workout_achievements")]
public partial class WorkoutAchievement
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("member_id")]
    public int MemberId { get; set; }

    [Column("achievement_type")]
    [StringLength(100)]
    public string AchievementType { get; set; } = null!;

    [Column("achievement_name")]
    [StringLength(200)]
    public string AchievementName { get; set; } = null!;

    [Column("achievement_description")]
    public string? AchievementDescription { get; set; }

    [Column("category_id")]
    public int? CategoryId { get; set; }

    [Column("earned_date", TypeName = "timestamp without time zone")]
    public DateTime? EarnedDate { get; set; }

    [Column("workout_result_id")]
    public int? WorkoutResultId { get; set; }

    [ForeignKey("MemberId")]
    [InverseProperty("Achievements")]
    public virtual Member Member { get; set; } = null!;

    [ForeignKey("CategoryId")]
    [InverseProperty("Achievements")]
    public virtual WorkoutCategory? Category { get; set; }

    [ForeignKey("WorkoutResultId")]
    [InverseProperty("Achievements")]
    public virtual WorkoutResult? WorkoutResult { get; set; }
}