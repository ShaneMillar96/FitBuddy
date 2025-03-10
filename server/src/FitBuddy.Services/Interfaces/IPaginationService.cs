using FitBuddy.Services.Dtos.Pagination;

namespace FitBuddy.Services.Interfaces;

public interface IPaginationService
{
    Task<PaginatedDto<T>> CreatePaginatedResponseAsync<T>(IQueryable<T> query, int pageSize, int pageNumber);
}