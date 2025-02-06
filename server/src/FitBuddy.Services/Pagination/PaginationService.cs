using FitBuddy.Services.Dtos.Pagination;
using FitBuddy.Services.Extensions;
using FitBuddy.Services.Interfaces;

namespace FitBuddy.Services.Pagination;

public class PaginationService : IPaginationService
{
    public async Task<PaginatedDto<T>> CreatePaginatedResponseAsync<T>(IQueryable<T> query, int pageSize, int pageNumber)
    {
        var (items, totalCount) = await query.PaginateAsync(pageSize, pageNumber);
        return new PaginatedDto<T>
        {
            Data = items.ToArray(),
            TotalCount = totalCount
        };
    }
}