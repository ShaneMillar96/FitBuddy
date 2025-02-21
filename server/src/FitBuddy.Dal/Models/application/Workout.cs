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

    [Column("created_by")]
    public int? CreatedBy { get; set; }

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime? CreatedDate { get; set; }

    [Column("modified_date", TypeName = "timestamp without time zone")]
    public DateTime? ModifiedDate { get; set; }

    [InverseProperty("Workout")]
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    [ForeignKey("CreatedBy")]
    [InverseProperty("Workouts")]
    public virtual Member? CreatedByNavigation { get; set; }

    [InverseProperty("Workout")]
    public virtual ICollection<WorkoutResult> WorkoutResults { get; set; } = new List<WorkoutResult>();

    [ForeignKey("WorkoutTypeId")]
    [InverseProperty("Workouts")]
    public virtual WorkoutType WorkoutType { get; set; } = null!;
}
