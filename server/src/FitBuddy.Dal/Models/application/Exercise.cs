using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitBuddy.Dal.Models.application;

[Table("exercises")]
public partial class Exercise
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    [StringLength(200)]
    public string Name { get; set; } = null!;

    [Column("category_id")]
    public int CategoryId { get; set; }

    [Column("description")]
    public string? Description { get; set; }

    [Column("instructions")]
    public string? Instructions { get; set; }

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime? CreatedDate { get; set; }

    [ForeignKey("CategoryId")]
    [InverseProperty("Exercises")]
    public virtual WorkoutCategory Category { get; set; } = null!;

    [InverseProperty("Exercise")]
    public virtual ICollection<WorkoutExercise> WorkoutExercises { get; set; } = new List<WorkoutExercise>();

    [InverseProperty("Exercise")]
    public virtual ICollection<ExerciseResult> ExerciseResults { get; set; } = new List<ExerciseResult>();
}