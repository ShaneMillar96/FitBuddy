using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FitBuddy.Dal.Models.application;

[Table("user_claims")]
public partial class UserClaim
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [Column("claim_type")]
    public string? ClaimType { get; set; }

    [Column("claim_value")]
    public string? ClaimValue { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("UserClaims")]
    public virtual Member User { get; set; } = null!;
}
