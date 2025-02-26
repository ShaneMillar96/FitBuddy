using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitBuddy.Dal.Models.application;

[Table("exercise_types")]
[Microsoft.EntityFrameworkCore.Index("Name", Name = "exercise_types_name_key", IsUnique = true)]
public partial class ExerciseType
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    [StringLength(50)]
    public string Name { get; set; } = null!;

    [InverseProperty("ExerciseType")]
    public virtual ICollection<ExerciseVideo> ExerciseVideos { get; set; } = new List<ExerciseVideo>();
}
