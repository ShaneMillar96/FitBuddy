﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FitBuddy.Dal.Interfaces;
using System.Text.Json;
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

    [Column("created_by_id")]
    public int CreatedById { get; set; }

    [Column("result")]
    public string? Result { get; set; }

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime CreatedDate { get; set; }

    [Column("modified_date", TypeName = "timestamp without time zone")]
    public DateTime? ModifiedDate { get; set; }

    // Basic fields from original schema
    [Column("duration")]
    public int? Duration { get; set; }

    [Column("avg_heart_rate")]
    public int? AvgHeartRate { get; set; }

    [Column("calories_burned")]
    public int? CaloriesBurned { get; set; }

    // CrossFit enhancement fields from simplified schema
    [Column("completion_time_seconds")]
    public int? CompletionTimeSeconds { get; set; }

    [Column("difficulty_rating")]
    public int? DifficultyRating { get; set; }

    [Column("workout_rating")]
    public int? WorkoutRating { get; set; }

    [Column("rpe_rating")]
    public int? RpeRating { get; set; }

    [Column("notes")]
    public string? Notes { get; set; }

    [Column("is_personal_record")]
    public bool IsPersonalRecord { get; set; }

    [ForeignKey("CreatedById")]
    [InverseProperty("WorkoutResults")]
    public virtual Member CreatedBy { get; set; } = null!;

    [ForeignKey("WorkoutId")]
    [InverseProperty("WorkoutResults")]
    public virtual Workout Workout { get; set; } = null!;

    [InverseProperty("WorkoutResult")]
    public virtual ICollection<ExerciseResult> ExerciseResults { get; set; } = new List<ExerciseResult>();

    [InverseProperty("WorkoutResult")]
    public virtual ICollection<WorkoutAchievement> Achievements { get; set; } = new List<WorkoutAchievement>();
}
