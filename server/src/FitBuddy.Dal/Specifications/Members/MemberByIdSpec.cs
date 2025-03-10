using System.Linq.Expressions;
using FitBuddy.Dal.Models.application;
using Unosquare.EntityFramework.Specification.Common.Primitive;

namespace FitBuddy.Dal.Specifications.Members;

public class MemberByIdSpec : Specification<Member>
{
    private readonly int _id;

    public MemberByIdSpec(int id)
    {
        _id = id;
    }

    public override Expression<Func<Member, bool>> BuildExpression()
    {
        return x => x.Id == _id;
    }
}