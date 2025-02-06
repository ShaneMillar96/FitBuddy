using FitBuddy.Api.ViewModels.Members;

namespace FitBuddy.Api.ViewModels.Workouts;

public class WorkoutViewModel
{
    public int Id { get; set; }
    
    public string Name { get; set; }
    
    public string Description { get; set; }
    
    public WorkoutTypeViewModel Type { get; set; }
    
    public MemberViewModel CreatedBy { get;set; }
    
    public DateTime CreatedDate { get; set; }
    
    public DateTime? ModifiedDate { get; set; }
}