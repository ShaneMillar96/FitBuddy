
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitBuddy.Dal.Models.application;

[Table("members")]
[Microsoft.EntityFrameworkCore.Index("Email", Name = "members_email_key", IsUnique = true)]
[Microsoft.EntityFrameworkCore.Index("Username", Name = "members_username_key", IsUnique = true)]
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

    [Column("password_hash")]
    public string PasswordHash { get; set; } = null!;

    [Column("garmin_access_token")]
    public string? GarminAccessToken { get; set; }

    [InverseProperty("CreatedBy")]
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    [InverseProperty("Member")]
    public virtual ICollection<ExerciseVideo> ExerciseVideos { get; set; } = new List<ExerciseVideo>();

    [InverseProperty("CreatedBy")]
    public virtual ICollection<WorkoutResult> WorkoutResults { get; set; } = new List<WorkoutResult>();

    [InverseProperty("CreatedBy")]
    public virtual ICollection<Workout> Workouts { get; set; } = new List<Workout>();

    [InverseProperty("CreatedBy")]
    public virtual ICollection<ExerciseResult> ExerciseResults { get; set; } = new List<ExerciseResult>();

    [InverseProperty("Member")]
    public virtual ICollection<WorkoutAchievement> Achievements { get; set; } = new List<WorkoutAchievement>();
}
