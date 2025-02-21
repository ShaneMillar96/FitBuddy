using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FitBuddy.Dal.Interfaces;

namespace FitBuddy.Dal.Models.application;

[Table("workouts")]
[Microsoft.EntityFrameworkCore.Index("Name", Name = "workouts_name_key", IsUnique = true)]
public partial class Workout : ICreatedByTracking
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    [StringLength(255)]
    public string Name { get; set; } = null!;

    [Column("description")]
    public string? Description { get; set; }

    [Column("workout_type_id")]
    public int WorkoutTypeId { get; set; }

    [Column("created_by_id")]
    public int CreatedById { get; set; }

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime? CreatedDate { get; set; }

    [Column("modified_date", TypeName = "timestamp without time zone")]
    public DateTime? ModifiedDate { get; set; }

    [Column("score_type_id")]
    public int? ScoreTypeId { get; set; }

    [InverseProperty("Workout")]
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    [ForeignKey("CreatedById")]
    [InverseProperty("Workouts")]
    public virtual Member CreatedBy { get; set; } = null!;

    [ForeignKey("ScoreTypeId")]
    [InverseProperty("Workouts")]
    public virtual ScoreType? ScoreType { get; set; }

    [InverseProperty("Workout")]
    public virtual ICollection<WorkoutResult> WorkoutResults { get; set; } = new List<WorkoutResult>();

    [ForeignKey("WorkoutTypeId")]
    [InverseProperty("Workouts")]
    public virtual WorkoutType WorkoutType { get; set; } = null!;
}
