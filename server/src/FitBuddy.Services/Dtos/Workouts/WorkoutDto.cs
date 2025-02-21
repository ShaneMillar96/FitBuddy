using FitBuddy.Services.Dtos.Members;

namespace FitBuddy.Services.Dtos.Workouts;

public class WorkoutDto
{
    public int Id { get; set; }
    
    public string Name { get; set; }

    public string Description { get; set; }
    
    public WorkoutTypeDto WorkoutType { get; set; }
    
    public ScoreTypeDto ScoreType { get; set; }

    public MemberDto CreatedBy { get;set; }
    
    public DateTime CreatedDate { get; set; }
    
    public DateTime? ModifiedDate { get; set; }
}