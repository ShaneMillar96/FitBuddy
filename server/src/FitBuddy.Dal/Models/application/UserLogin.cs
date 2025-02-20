using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FitBuddy.Dal.Models.application;

[PrimaryKey("LoginProvider", "ProviderKey")]
[Table("user_logins")]
public partial class UserLogin
{
    [Key]
    [Column("login_provider")]
    [StringLength(128)]
    public string LoginProvider { get; set; } = null!;

    [Key]
    [Column("provider_key")]
    [StringLength(128)]
    public string ProviderKey { get; set; } = null!;

    [Column("provider_display_name")]
    [StringLength(256)]
    public string? ProviderDisplayName { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("UserLogins")]
    public virtual Member User { get; set; } = null!;
}
