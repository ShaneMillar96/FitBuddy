using System.Linq.Expressions;
using FitBuddy.Dal.Models.application;
using Unosquare.EntityFramework.Specification.Common.Primitive;

namespace FitBuddy.Dal.Specifications.Comments;

public class CommentByIdSpec : Specification<Comment>
{
    private readonly int _id;
    
    public CommentByIdSpec(int id)
    {
        _id = id;
    }
    
    public override Expression<Func<Comment, bool>> BuildExpression()
    {
        return x => x.Id == _id;
    }
}