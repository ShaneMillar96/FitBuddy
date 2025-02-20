using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FitBuddy.Dal.Models.application;

[Table("workout_results")]
public partial class WorkoutResult
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("workout_id")]
    public int WorkoutId { get; set; }

    [Column("member_id")]
    public int MemberId { get; set; }

    [Column("result")]
    public string? Result { get; set; }

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime? CreatedDate { get; set; }

    [Column("modified_date", TypeName = "timestamp without time zone")]
    public DateTime? ModifiedDate { get; set; }

    [ForeignKey("MemberId")]
    [InverseProperty("WorkoutResults")]
    public virtual Member Member { get; set; } = null!;

    [ForeignKey("WorkoutId")]
    [InverseProperty("WorkoutResults")]
    public virtual Workout Workout { get; set; } = null!;
}
