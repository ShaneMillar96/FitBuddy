using FitBuddy.Api.ViewModels.Members;

namespace FitBuddy.Api.ViewModels.Workouts;

public class WorkoutFavoriteViewModel
{
    public int Id { get; set; }
    public int MemberId { get; set; }
    public int WorkoutId { get; set; }
    public DateTime CreatedDate { get; set; }
    
    // Navigation properties
    public WorkoutViewModel? Workout { get; set; }
    public MemberViewModel? Member { get; set; }
}

public class ToggleFavoriteResultViewModel
{
    public bool IsFavorited { get; set; }
    public int TotalFavorites { get; set; }
}