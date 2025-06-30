using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FitBuddy.Dal.Interfaces;

namespace FitBuddy.Dal.Models.application;

[Table("workout_favorites")]
public partial class WorkoutFavorite
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("member_id")]
    public int MemberId { get; set; }

    [Column("workout_id")]
    public int WorkoutId { get; set; }

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime? CreatedDate { get; set; }

    // Navigation properties
    [ForeignKey("MemberId")]
    [InverseProperty("WorkoutFavorites")]
    public virtual Member Member { get; set; } = null!;

    [ForeignKey("WorkoutId")]
    [InverseProperty("WorkoutFavorites")]
    public virtual Workout Workout { get; set; } = null!;

}