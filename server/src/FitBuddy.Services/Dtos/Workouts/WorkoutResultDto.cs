using FitBuddy.Services.Dtos.Members;

namespace FitBuddy.Services.Dtos.Workouts;

public class WorkoutResultDto
{
    public int Id { get; set; }
    
    public string Result { get; set; }
    
    public MemberDto Member { get; set; }
}