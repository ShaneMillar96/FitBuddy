using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FitBuddy.Dal.Models.application;

[Table("roles")]
public partial class Role
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    [StringLength(256)]
    public string? Name { get; set; }

    [Column("normalized_name")]
    [StringLength(256)]
    public string? NormalizedName { get; set; }

    [Column("concurrency_stamp")]
    [StringLength(255)]
    public string? ConcurrencyStamp { get; set; }

    [InverseProperty("Role")]
    public virtual ICollection<RoleClaim> RoleClaims { get; set; } = new List<RoleClaim>();

    [ForeignKey("RoleId")]
    [InverseProperty("Roles")]
    public virtual ICollection<Member> Users { get; set; } = new List<Member>();
}
