using FitBuddy.Api.ViewModels.Members;

namespace FitBuddy.Api.ViewModels.Workouts;

public class WorkoutResultViewModel
{
    public int Id { get; set; }
    
    public string Result { get; set; }
    
    public MemberViewModel Member { get; set; }
}