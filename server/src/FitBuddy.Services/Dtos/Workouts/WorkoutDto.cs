using FitBuddy.Services.Dtos.Members;
using FitBuddy.Services.Dtos.Exercises;

namespace FitBuddy.Services.Dtos.Workouts;

public class WorkoutDto
{
    public int Id { get; set; }
    
    public string Name { get; set; }

    public string Description { get; set; }
    
    public WorkoutTypeDto WorkoutType { get; set; }
    
    public ScoreTypeDto ScoreType { get; set; }

    public MemberDto CreatedBy { get;set; }
    
    public int CommentsCount { get; set; }

    public int ResultsLogged { get; set; }
    public DateTime CreatedDate { get; set; }
    
    public DateTime? ModifiedDate { get; set; }
    
    public List<WorkoutExerciseDto> WorkoutExercises { get; set; } = new();
}