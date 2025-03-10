using Microsoft.AspNetCore.Mvc;

namespace FitBuddy.Services.Dtos.Pagination;

public class PaginationDto
{
    public int PageSize { get; set; } = 20;
    public int PageNumber { get; set; }
    public string? Search { get; set; }
    public string? SortBy { get; set; }
    public bool Ascending { get; set; } = true; 
    
    public void Deconstruct(out int pageSize, out int pageNumber, out string? search, out string? sortBy, out bool ascending)
    {
        pageSize = PageSize;
        pageNumber = PageNumber;
        search = Search;
        sortBy = SortBy;
        ascending = Ascending;
    }
}