using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FitBuddy.Dal.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitBuddy.Dal.Models.application;

[Table("workout_results")]
public partial class WorkoutResult : ICreatedByTracking
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("workout_id")]
    public int WorkoutId { get; set; }

    [Column("created_by")]
    public int CreatedBy { get; set; }

    [Column("result")]
    public string? Result { get; set; }

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime? CreatedDate { get; set; }

    [Column("modified_date", TypeName = "timestamp without time zone")]
    public DateTime? ModifiedDate { get; set; }

    [ForeignKey("CreatedBy")]
    [InverseProperty("WorkoutResults")]
    public virtual Member CreatedByNavigation { get; set; } = null!;

    [ForeignKey("WorkoutId")]
    [InverseProperty("WorkoutResults")]
    public virtual Workout Workout { get; set; } = null!;
}
