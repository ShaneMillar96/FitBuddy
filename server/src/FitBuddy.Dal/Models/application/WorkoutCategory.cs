using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitBuddy.Dal.Models.application;

[Table("workout_categories")]
public partial class WorkoutCategory
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    [StringLength(100)]
    public string Name { get; set; } = null!;

    [Column("description")]
    public string? Description { get; set; }

    [Column("icon")]
    [StringLength(50)]
    public string? Icon { get; set; }

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime? CreatedDate { get; set; }

    [InverseProperty("Category")]
    public virtual ICollection<WorkoutSubType> SubTypes { get; set; } = new List<WorkoutSubType>();

    [InverseProperty("Category")]
    public virtual ICollection<Workout> Workouts { get; set; } = new List<Workout>();

    [InverseProperty("Category")]
    public virtual ICollection<Exercise> Exercises { get; set; } = new List<Exercise>();

    [InverseProperty("Category")]
    public virtual ICollection<WorkoutAchievement> Achievements { get; set; } = new List<WorkoutAchievement>();
}