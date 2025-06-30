namespace FitBuddy.Services.Dtos.Workouts;

public class WorkoutFavoriteDto
{
    public int Id { get; set; }
    public int MemberId { get; set; }
    public int WorkoutId { get; set; }
    public DateTime CreatedDate { get; set; }
    
    // Navigation properties
    public WorkoutDto? Workout { get; set; }
    public Members.MemberDto? Member { get; set; }
}

public class CreateWorkoutFavoriteDto
{
    public int WorkoutId { get; set; }
}

public class ToggleFavoriteResultDto
{
    public bool IsFavorited { get; set; }
    public int TotalFavorites { get; set; }
}