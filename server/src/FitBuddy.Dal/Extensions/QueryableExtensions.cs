using System.Linq.Expressions;
using System.Reflection;

namespace FitBuddy.Dal.Extensions;

public static class QueryableExtensions
{
    public static IQueryable<T> OrderBy<T>(this IQueryable<T> @this, string sortBy, bool ascending = true)
    {
        if (string.IsNullOrEmpty(sortBy)) return @this;

        var propertyInfo = typeof(T).GetProperty(sortBy, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
        if (propertyInfo == null) throw new ArgumentException($"Could not find a property named {sortBy} on type {typeof(T).Name}.");

        var parameter = Expression.Parameter(typeof(T), "x");
        var property = Expression.Property(parameter, propertyInfo);
        var lambda = Expression.Lambda<Func<T, object>>(Expression.Convert(property, typeof(object)), parameter);
        return ascending ? @this.OrderBy(lambda) : @this.OrderByDescending(lambda);
    }
}