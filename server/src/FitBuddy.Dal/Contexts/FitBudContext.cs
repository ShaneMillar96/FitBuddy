using FitBuddy.Dal.Enums;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Dal.Models.application;
using Microsoft.EntityFrameworkCore;

namespace FitBuddy.Dal.Contexts;

public class FitBudContext : BaseContext, IFitBudContext
{
    public FitBudContext(IConnectionManager connectionManager) : base(connectionManager) { }
    
    protected override DatabaseTypes RetrieveDatabaseType() => DatabaseTypes.Application;

    public virtual DbSet<WorkoutResult> WorkoutResults { get; set; }
    public virtual DbSet<Workout> Workouts { get; set; }
    public virtual DbSet<WorkoutType> WorkoutTypes { get; set; }
    public virtual DbSet<Member> Members { get; set; }
    public virtual DbSet<Comment> Comments { get; set; }
}