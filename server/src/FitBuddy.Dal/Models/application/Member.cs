using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FitBuddy.Dal.Models.application;

[Table("members")]
[Index("Email", Name = "members_email_key", IsUnique = true)]
[Index("Username", Name = "members_username_key", IsUnique = true)]
public partial class Member
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("username")]
    [StringLength(255)]
    public string Username { get; set; } = null!;

    [Column("email")]
    [StringLength(255)]
    public string Email { get; set; } = null!;

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime? CreatedDate { get; set; }

    [Column("modified_date", TypeName = "timestamp without time zone")]
    public DateTime? ModifiedDate { get; set; }

    [InverseProperty("Member")]
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    [InverseProperty("Member")]
    public virtual ICollection<WorkoutResult> WorkoutResults { get; set; } = new List<WorkoutResult>();

    [InverseProperty("CreatedByNavigation")]
    public virtual ICollection<Workout> Workouts { get; set; } = new List<Workout>();
}
