using System.Linq.Expressions;
using FitBuddy.Dal.Models.application;
using Unosquare.EntityFramework.Specification.Common.Primitive;

namespace FitBuddy.Dal.Specifications.Workouts;

public class WorkoutByIdSpec : Specification<Workout>
{
    private readonly int _id;

    public WorkoutByIdSpec(int id)
    {
        _id = id;
    }

    public override Expression<Func<Workout, bool>> BuildExpression()
    {
        return x => x.Id == _id;
    }
}