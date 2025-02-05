using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FitBuddy.Dal.Models.application;

[Table("workout_types")]
[Index("Name", Name = "workout_types_name_key", IsUnique = true)]
public partial class WorkoutType
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    [StringLength(255)]
    public string Name { get; set; } = null!;

    [InverseProperty("WorkoutType")]
    public virtual ICollection<Workout> Workouts { get; set; } = new List<Workout>();
}
