using FitBuddy.Services.Dtos.Pagination;
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

    public static async Task<PaginatedDto<TResult>> PaginateAsync<TSource, TResult>(
        this IQueryable<TSource> query, 
        PaginationDto pagination, 
        Func<TSource, TResult> selector)
    {
        var pageSize = pagination.PageSize > 0 ? pagination.PageSize : 10;
        var pageNumber = pagination.PageNumber > 0 ? pagination.PageNumber : 1;
        
        var futureCount = query.DeferredCount().FutureValue();
        var futureItems = query.Skip((pageNumber - 1) * pageSize).Take(pageSize).Future();

        var totalCount = futureCount.Value;
        var items = await futureItems.ToArrayAsync();
        var projectedItems = items.Select(selector).ToArray();

        return new PaginatedDto<TResult>
        {
            Data = projectedItems,
            TotalCount = totalCount
        };
    }
}