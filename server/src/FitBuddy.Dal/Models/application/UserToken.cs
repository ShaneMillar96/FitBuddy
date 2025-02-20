using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace FitBuddy.Dal.Models.application;

[PrimaryKey("UserId", "LoginProvider", "Name")]
[Table("user_tokens")]
public partial class UserToken
{
    [Key]
    [Column("user_id")]
    public int UserId { get; set; }

    [Key]
    [Column("login_provider")]
    [StringLength(128)]
    public string LoginProvider { get; set; } = null!;

    [Key]
    [Column("name")]
    [StringLength(128)]
    public string Name { get; set; } = null!;

    [Column("value")]
    public string? Value { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("UserTokens")]
    public virtual Member User { get; set; } = null!;
}
