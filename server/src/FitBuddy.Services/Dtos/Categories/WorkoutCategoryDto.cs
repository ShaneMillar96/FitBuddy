namespace FitBuddy.Services.Dtos.Categories;

public class WorkoutCategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public DateTime? CreatedDate { get; set; }
    public List<WorkoutSubTypeDto> SubTypes { get; set; } = new();
}

public class WorkoutSubTypeDto
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime? CreatedDate { get; set; }
}

public class CreateWorkoutCategoryDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? Icon { get; set; }
}

public class UpdateWorkoutCategoryDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? Icon { get; set; }
}