using System.Linq.Expressions;
using FitBuddy.Dal.Models.application;
using Unosquare.EntityFramework.Specification.Common.Primitive;

namespace FitBuddy.Dal.Specifications.Workouts;

public class WorkoutResultByWorkoutIdSpec : Specification<WorkoutResult>
{
    private readonly int _workoutId;

    public WorkoutResultByWorkoutIdSpec(int workoutId)
    {
        _workoutId = workoutId;
    }

    public override Expression<Func<WorkoutResult, bool>> BuildExpression()
    {
        return workoutResult => workoutResult.WorkoutId == _workoutId;
    }
}