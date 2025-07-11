using FitBuddy.Dal.Models.application;
using FitBuddy.Services.Dtos.Members;

namespace FitBuddy.Services.Dtos.Workouts;

public class WorkoutResultDto
{
    public int Id { get; set; }
    
    public string Result { get; set; }
    public WorkoutTypeDto Type { get; set; }
    public MemberDto Member { get; set; }
    
    public DateTime CreatedDate { get; set; }
    
    public int? Duration { get; set; } 
    
    public int? AvgHeartRate { get; set; } 
    
    public int? CaloriesBurned { get; set; }
    
}