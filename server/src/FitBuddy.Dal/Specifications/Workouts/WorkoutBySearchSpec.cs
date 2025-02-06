using System.Linq.Expressions;
using FitBuddy.Dal.Models.application;
using Unosquare.EntityFramework.Specification.Common.Primitive;

namespace FitBuddy.Dal.Specifications.Workouts;

public class WorkoutBySearchSpec : Specification<Workout>
{
    private readonly Specification<Workout> _spec;
    
    public WorkoutBySearchSpec(string? search) =>_spec = new WorkoutByNameSpec(search);
    
    public override Expression<Func<Workout, bool>> BuildExpression() =>
        _spec.BuildExpression();
}