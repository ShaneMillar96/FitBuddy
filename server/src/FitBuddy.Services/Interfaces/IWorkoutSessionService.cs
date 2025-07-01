using FitBuddy.Services.Dtos.Sessions;
using FitBuddy.Services.Dtos.Workouts;

namespace FitBuddy.Services.Interfaces;

public interface IWorkoutSessionService
{
    // Session lifecycle management
    Task<string> StartSession(CreateWorkoutSessionDto sessionDto);
    Task<bool> PauseSession(string sessionId);
    Task<bool> ResumeSession(string sessionId);
    Task<bool> AbandonSession(string sessionId);
    Task<int> CompleteSession(CompleteWorkoutSessionDto sessionDto);
    
    // Session retrieval
    Task<WorkoutSessionDto?> GetSession(string sessionId);
    Task<WorkoutSessionDto?> GetActiveMemberSession(int memberId);
    Task<List<WorkoutSessionDto>> GetMemberSessions(int memberId, int? workoutId = null);
    
    // Exercise progress management
    Task<bool> UpdateExerciseProgress(string sessionId, int exerciseId, UpdateSessionExerciseProgressDto progressDto);
    Task<bool> StartExercise(string sessionId, int exerciseId);
    Task<bool> CompleteExercise(string sessionId, int exerciseId);
    Task<bool> SkipExercise(string sessionId, int exerciseId);
    
    // Set progress management
    Task<bool> StartSet(string sessionId, int exerciseId, int setNumber);
    Task<bool> CompleteSet(string sessionId, int exerciseId, int setNumber, UpdateSessionSetProgressDto setDto);
    Task<bool> UpdateSetProgress(string sessionId, int exerciseId, int setNumber, UpdateSessionSetProgressDto setDto);
    
    // Session validation
    Task<bool> SessionExists(string sessionId);
    Task<bool> IsSessionActive(string sessionId);
    Task<bool> IsSessionOwnedByMember(string sessionId, int memberId);
    
    // Session cleanup
    Task<int> CleanupAbandonedSessions(TimeSpan olderThan);
}