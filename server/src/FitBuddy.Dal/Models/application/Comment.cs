using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FitBuddy.Dal.Interfaces;

namespace FitBuddy.Dal.Models.application;

[Table("comments")]
public partial class Comment 

{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("workout_id")]
    public int WorkoutId { get; set; }

    [Column("member_id")]
    public int MemberId { get; set; }

    [Column("description")]
    public string? Description { get; set; }

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime? CreatedDate { get; set; }

    [Column("modified_date", TypeName = "timestamp without time zone")]
    public DateTime? ModifiedDate { get; set; }

    [ForeignKey("MemberId")]
    [InverseProperty("Comments")]
    public virtual Member Member { get; set; } = null!;

    [ForeignKey("WorkoutId")]
    [InverseProperty("Comments")]
    public virtual Workout Workout { get; set; } = null!;
}
