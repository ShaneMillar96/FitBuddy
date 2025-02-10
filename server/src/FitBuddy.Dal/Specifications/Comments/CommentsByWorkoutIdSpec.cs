using System.Linq.Expressions;
using FitBuddy.Dal.Models.application;
using Unosquare.EntityFramework.Specification.Common.Primitive;

namespace FitBuddy.Dal.Specifications.Comments;

public class CommentsByWorkoutIdSpec : Specification<Comment>
{
    private readonly int? _workoutId;
    
    public CommentsByWorkoutIdSpec(int? workoutId)
    {
        _workoutId = workoutId;
    }

    public override Expression<Func<Comment, bool>> BuildExpression()
    {
        if (!_workoutId.HasValue) return ShowAll;
        
        return comment => comment.WorkoutId == _workoutId;
    }

}