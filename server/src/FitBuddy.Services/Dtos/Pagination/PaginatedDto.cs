namespace FitBuddy.Services.Dtos.Pagination;

public class PaginatedDto<T>
{
    public T[] Data { get; set; }

    public int TotalCount { get; set; }
}