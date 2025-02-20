using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FitBuddy.Dal.Models.application;

[Table("role_claims")]
public partial class RoleClaim
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("role_id")]
    public int RoleId { get; set; }

    [Column("claim_type")]
    public string? ClaimType { get; set; }

    [Column("claim_value")]
    public string? ClaimValue { get; set; }

    [ForeignKey("RoleId")]
    [InverseProperty("RoleClaims")]
    public virtual Role Role { get; set; } = null!;
}
