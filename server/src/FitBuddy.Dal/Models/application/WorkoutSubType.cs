using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitBuddy.Dal.Models.application;

[Table("workout_sub_types")]
public partial class WorkoutSubType
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("category_id")]
    public int CategoryId { get; set; }

    [Column("name")]
    [StringLength(100)]
    public string Name { get; set; } = null!;

    [Column("description")]
    public string? Description { get; set; }

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime? CreatedDate { get; set; }

    [ForeignKey("CategoryId")]
    [InverseProperty("SubTypes")]
    public virtual WorkoutCategory Category { get; set; } = null!;

    [InverseProperty("SubType")]
    public virtual ICollection<Workout> Workouts { get; set; } = new List<Workout>();
}