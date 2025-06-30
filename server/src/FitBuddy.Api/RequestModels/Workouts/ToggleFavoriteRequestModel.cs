using System.ComponentModel.DataAnnotations;

namespace FitBuddy.Api.RequestModels.Workouts;

public class ToggleFavoriteRequestModel
{
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "WorkoutId must be a positive integer.")]
    public int WorkoutId { get; set; }
}