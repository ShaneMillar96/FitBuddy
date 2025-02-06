using System.Linq.Expressions;
using FitBuddy.Dal.Models.application;
using Unosquare.EntityFramework.Specification.Common.Primitive;


namespace FitBuddy.Dal.Specifications.Members;

public class MemberBySearchSpec: Specification<Member>
{
    private readonly Specification<Member> _spec;
    
    public MemberBySearchSpec(string? search) =>_spec = new MemberByNameSpec(search);
    
    public override Expression<Func<Member, bool>> BuildExpression() =>
        _spec.BuildExpression();
}