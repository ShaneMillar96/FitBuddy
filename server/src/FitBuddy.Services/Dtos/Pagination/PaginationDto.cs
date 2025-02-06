namespace FitBuddy.Services.Dtos.Pagination;

public class PaginationDto
{
    public int PageSize { get; set; } = 20;
    public int PageNumber { get; set; }
    public string SearchQuery { get; set; }
    public string SortBy { get; set; }
    public bool Ascending { get; set; } = true; 
    
    public void Deconstruct(out int pageSize, out int pageNumber, out string searchQuery, out string sortBy, out bool ascending)
    {
        pageSize = PageSize;
        pageNumber = PageNumber;
        searchQuery = SearchQuery;
        sortBy = SortBy;
        ascending = Ascending;
    }
}