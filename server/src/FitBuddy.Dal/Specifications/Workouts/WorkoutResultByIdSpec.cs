using System.Linq.Expressions;
using FitBuddy.Dal.Models.application;
using Unosquare.EntityFramework.Specification.Common.Primitive;

namespace FitBuddy.Dal.Specifications.Workouts;

public class WorkoutResultByIdSpec : Specification<WorkoutResult>
{
    private readonly int _id;
    
    public WorkoutResultByIdSpec(int id)
    {
        _id = id;
    }
    
    public override Expression<Func<WorkoutResult, bool>> BuildExpression()
    {
        return x => x.Id == _id;
    }
}