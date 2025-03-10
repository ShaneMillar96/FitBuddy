using System.Linq.Expressions;
using FitBuddy.Dal.Models.application;
using Unosquare.EntityFramework.Specification.Common.Primitive;

namespace FitBuddy.Dal.Specifications.Workouts;

public class WorkoutByNameSpec : Specification<Workout>
{
    private readonly string? _name;

    public WorkoutByNameSpec(string? name) => _name = name?.ToLower();

    public override Expression<Func<Workout, bool>> BuildExpression()
    {
        if (string.IsNullOrEmpty(_name)) return ShowAll;
        
        return x => x.Name.ToLower().StartsWith(_name);
    }
}