using System.Linq.Expressions;
using FitBuddy.Dal.Models.application;
using Unosquare.EntityFramework.Specification.Common.Primitive;

namespace FitBuddy.Dal.Specifications.Members;

public class MemberByNameSpec: Specification<Member>
{
    private readonly string? _username;

    public MemberByNameSpec(string? name) => _username = name?.ToLower();

    public override Expression<Func<Member, bool>> BuildExpression()
    {
        if (string.IsNullOrEmpty(_username)) return ShowAll;
        
        return x => x.Username.ToLower().StartsWith(_username);
    }
}