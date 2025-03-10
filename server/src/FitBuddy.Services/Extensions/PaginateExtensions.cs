using Z.EntityFramework.Plus;

namespace FitBuddy.Services.Extensions;

public static class PaginateExtensions
{
    public static async Task<(T[] Items, int TotalCount)> PaginateAsync<T>(this IQueryable<T> query, int pageSize, int pageNumber)
    {
        pageSize = pageSize > 0 ? pageSize : 10; 
        pageNumber = pageNumber > 0 ? pageNumber : 1;
        
        var futureCount = query.DeferredCount().FutureValue();
        var futureItems = query.Skip((pageNumber - 1) * pageSize).Take(pageSize).Future();

        var totalCount = futureCount.Value;
        var items = await futureItems.ToArrayAsync();

        return (items, totalCount);
    }
}