using System.ComponentModel.DataAnnotations;

namespace FitBuddy.Api.RequestModels.Categories;

public class CreateWorkoutCategoryRequestModel
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = null!;

    [StringLength(500)]
    public string? Description { get; set; }

    [StringLength(50)]
    public string? Icon { get; set; }
}

public class UpdateWorkoutCategoryRequestModel
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = null!;

    [StringLength(500)]
    public string? Description { get; set; }

    [StringLength(50)]
    public string? Icon { get; set; }
}