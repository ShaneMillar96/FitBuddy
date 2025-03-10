﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FitBuddy.Dal.Interfaces;

namespace FitBuddy.Dal.Models.application;

[Table("workout_results")]
public partial class WorkoutResult : ICreatedByTracking
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("workout_id")]
    public int WorkoutId { get; set; }

    [Column("created_by_id")]
    public int CreatedById { get; set; }

    [Column("result")]
    public string? Result { get; set; }

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime CreatedDate { get; set; }

    [Column("modified_date", TypeName = "timestamp without time zone")]
    public DateTime? ModifiedDate { get; set; }

    [Column("duration")]
    public int? Duration { get; set; }

    [Column("avg_heart_rate")]
    public int? AvgHeartRate { get; set; }

    [Column("calories_burned")]
    public int? CaloriesBurned { get; set; }

    [Column("garmin_activity_id")]
    [StringLength(50)]
    public string? GarminActivityId { get; set; }

    [ForeignKey("CreatedById")]
    [InverseProperty("WorkoutResults")]
    public virtual Member CreatedBy { get; set; } = null!;

    [ForeignKey("WorkoutId")]
    [InverseProperty("WorkoutResults")]
    public virtual Workout Workout { get; set; } = null!;
}
