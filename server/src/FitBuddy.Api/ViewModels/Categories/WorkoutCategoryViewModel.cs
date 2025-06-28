namespace FitBuddy.Api.ViewModels.Categories;

public class WorkoutCategoryViewModel
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public DateTime? CreatedDate { get; set; }
    public List<WorkoutSubTypeViewModel> SubTypes { get; set; } = new();
}

public class WorkoutSubTypeViewModel
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime? CreatedDate { get; set; }
}