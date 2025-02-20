using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace FitBuddy.Dal.Models.application;

[Table("members")]
public class Member : IdentityUser<int>
{
    [Column("id")]
    public override int Id { get; set; } 

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime? CreatedDate { get; set; }

    [Column("modified_date", TypeName = "timestamp without time zone")]
    public DateTime? ModifiedDate { get; set; }

    [InverseProperty("Member")]
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    [InverseProperty("User")]
    public virtual ICollection<UserClaim> UserClaims { get; set; } = new List<UserClaim>();

    [InverseProperty("User")]
    public virtual ICollection<UserLogin> UserLogins { get; set; } = new List<UserLogin>();

    [InverseProperty("User")]
    public virtual ICollection<UserToken> UserTokens { get; set; } = new List<UserToken>();

    [InverseProperty("Member")]
    public virtual ICollection<WorkoutResult> WorkoutResults { get; set; } = new List<WorkoutResult>();

    [InverseProperty("CreatedByNavigation")]
    public virtual ICollection<Workout> Workouts { get; set; } = new List<Workout>();

    [ForeignKey("UserId")]
    [InverseProperty("Users")]
    public virtual ICollection<Role> Roles { get; set; } = new List<Role>();
}
