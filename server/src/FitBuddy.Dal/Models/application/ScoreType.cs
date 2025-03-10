using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitBuddy.Dal.Models.application;

[Table("score_types")]
public partial class ScoreType
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    [StringLength(50)]
    public string Name { get; set; } = null!;

    [InverseProperty("ScoreType")]
    public virtual ICollection<Workout> Workouts { get; set; } = new List<Workout>();
}
