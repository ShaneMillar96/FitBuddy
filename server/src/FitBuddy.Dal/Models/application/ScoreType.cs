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
    [StringLength(100)]
    public string Name { get; set; } = null!;

    [Column("description")]
    public string? Description { get; set; }

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime? CreatedDate { get; set; }

    [InverseProperty("ScoreType")]
    public virtual ICollection<Workout> Workouts { get; set; } = new List<Workout>();
}
