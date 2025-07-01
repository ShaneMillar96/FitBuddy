using AutoMapper;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Dal.Models.application;
using FitBuddy.Services.Dtos.Sessions;
using FitBuddy.Services.Dtos.Workouts;
using FitBuddy.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FitBuddy.Services.Services;

public class WorkoutSessionService : IWorkoutSessionService
{
    private readonly IFitBudContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<WorkoutSessionService> _logger;
    private readonly IWorkoutService _workoutService;

    public WorkoutSessionService(
        IFitBudContext context, 
        IMapper mapper, 
        ILogger<WorkoutSessionService> logger,
        IWorkoutService workoutService)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
        _workoutService = workoutService;
    }

    public async Task<string> StartSession(CreateWorkoutSessionDto sessionDto)
    {
        try
        {
            var memberId = _context.GetCurrentUserId();
            if (memberId == 0)
                throw new UnauthorizedAccessException("User not authenticated");

            // Check if member already has an active session
            var existingSession = await _context.Get<WorkoutSession>()
                .FirstOrDefaultAsync(s => s.MemberId == memberId && 
                                    (s.Status == SessionStatus.Active || s.Status == SessionStatus.Paused));
            
            if (existingSession != null)
                throw new InvalidOperationException("Member already has an active workout session");

            // Validate workout exists
            var workout = await _context.Get<Workout>().FirstOrDefaultAsync(w => w.Id == sessionDto.WorkoutId);
            if (workout == null)
                throw new ArgumentException($"Workout with ID {sessionDto.WorkoutId} not found");

            var session = new WorkoutSession
            {
                Id = sessionDto.Id,
                WorkoutId = sessionDto.WorkoutId,
                MemberId = memberId,
                Status = SessionStatus.Active,
                StartTime = DateTime.UtcNow,
                CurrentExerciseIndex = 0,
                CreatedDate = DateTime.UtcNow
            };

            // Create exercise progress entries
            foreach (var exerciseDto in sessionDto.ExerciseProgress)
            {
                var exerciseProgress = new SessionExerciseProgress
                {
                    SessionId = session.Id,
                    ExerciseId = exerciseDto.ExerciseId,
                    OrderInWorkout = exerciseDto.OrderInWorkout,
                    Status = ExerciseStatus.NotStarted,
                    PlannedSets = exerciseDto.PlannedSets,
                    PlannedReps = exerciseDto.PlannedReps,
                    PlannedWeightKg = exerciseDto.PlannedWeightKg,
                    PlannedDistanceMeters = exerciseDto.PlannedDistanceMeters,
                    PlannedDurationSeconds = exerciseDto.PlannedDurationSeconds,
                    PlannedRestSeconds = exerciseDto.PlannedRestSeconds
                };

                // Create set progress entries
                var setCount = exerciseDto.PlannedSets ?? 1;
                for (int i = 1; i <= setCount; i++)
                {
                    exerciseProgress.Sets.Add(new SessionSetProgress
                    {
                        SetNumber = i,
                        Status = SetStatus.NotStarted
                    });
                }

                session.ExerciseProgress.Add(exerciseProgress);
            }

            _context.Add(session);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Started workout session {session.Id} for member {memberId}");
            return session.Id;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error starting workout session for workout {sessionDto.WorkoutId}");
            throw;
        }
    }

    public async Task<bool> PauseSession(string sessionId)
    {
        try
        {
            var session = await GetSessionEntity(sessionId);
            if (session == null || session.Status != SessionStatus.Active)
                return false;

            session.Status = SessionStatus.Paused;
            session.PausedAt = DateTime.UtcNow;
            session.ModifiedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error pausing session {sessionId}");
            return false;
        }
    }

    public async Task<bool> ResumeSession(string sessionId)
    {
        try
        {
            var session = await GetSessionEntity(sessionId);
            if (session == null || session.Status != SessionStatus.Paused)
                return false;

            if (session.PausedAt.HasValue)
            {
                var pausedDuration = (int)(DateTime.UtcNow - session.PausedAt.Value).TotalSeconds;
                session.TotalPausedTimeSeconds += pausedDuration;
            }

            session.Status = SessionStatus.Active;
            session.PausedAt = null;
            session.ModifiedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error resuming session {sessionId}");
            return false;
        }
    }

    public async Task<bool> AbandonSession(string sessionId)
    {
        try
        {
            var session = await GetSessionEntity(sessionId);
            if (session == null)
                return false;

            session.Status = SessionStatus.Abandoned;
            session.EndTime = DateTime.UtcNow;
            session.ModifiedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error abandoning session {sessionId}");
            return false;
        }
    }

    public async Task<int> CompleteSession(CompleteWorkoutSessionDto sessionDto)
    {
        try
        {
            var session = await GetSessionEntity(sessionDto.SessionId);
            if (session == null)
                throw new ArgumentException($"Session {sessionDto.SessionId} not found");

            var memberId = _context.GetCurrentUserId();
            if (session.MemberId != memberId)
                throw new UnauthorizedAccessException("Session does not belong to current user");

            // Mark session as completed
            session.Status = SessionStatus.Completed;
            session.EndTime = DateTime.UtcNow;
            session.ModifiedDate = DateTime.UtcNow;

            // Calculate session duration
            var totalDuration = session.EndTime.Value - session.StartTime!.Value;
            var adjustedDuration = totalDuration.TotalSeconds - session.TotalPausedTimeSeconds;

            // Create WorkoutResult based on session data
            var workoutResultDto = new CreateWorkoutResultDto
            {
                WorkoutId = session.WorkoutId,
                Result = CalculateWorkoutResult(session),
                Duration = (int)adjustedDuration,
                // Map session completion data to workout result
                // Additional fields can be mapped based on sessionDto
            };

            var resultId = await _workoutService.CreateWorkoutResult(workoutResultDto);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Completed workout session {session.Id} and created result {resultId}");
            return resultId;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error completing session {sessionDto.SessionId}");
            throw;
        }
    }

    public async Task<WorkoutSessionDto?> GetSession(string sessionId)
    {
        try
        {
            var session = await _context.Get<WorkoutSession>()
                .Include(s => s.Workout)
                .Include(s => s.ExerciseProgress)
                    .ThenInclude(ep => ep.Exercise)
                .Include(s => s.ExerciseProgress)
                    .ThenInclude(ep => ep.Sets)
                .FirstOrDefaultAsync(s => s.Id == sessionId);

            return session == null ? null : _mapper.Map<WorkoutSessionDto>(session);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error retrieving session {sessionId}");
            return null;
        }
    }

    public async Task<WorkoutSessionDto?> GetActiveMemberSession(int memberId)
    {
        try
        {
            var session = await _context.Get<WorkoutSession>()
                .Include(s => s.Workout)
                .Include(s => s.ExerciseProgress)
                    .ThenInclude(ep => ep.Exercise)
                .Include(s => s.ExerciseProgress)
                    .ThenInclude(ep => ep.Sets)
                .FirstOrDefaultAsync(s => s.MemberId == memberId && 
                                    (s.Status == SessionStatus.Active || s.Status == SessionStatus.Paused));

            return session == null ? null : _mapper.Map<WorkoutSessionDto>(session);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error retrieving active session for member {memberId}");
            return null;
        }
    }

    public async Task<List<WorkoutSessionDto>> GetMemberSessions(int memberId, int? workoutId = null)
    {
        try
        {
            var query = _context.Get<WorkoutSession>()
                .Include(s => s.Workout)
                .Include(s => s.ExerciseProgress)
                    .ThenInclude(ep => ep.Exercise)
                .Where(s => s.MemberId == memberId);

            if (workoutId.HasValue)
                query = query.Where(s => s.WorkoutId == workoutId.Value);

            var sessions = await query
                .OrderByDescending(s => s.CreatedDate)
                .ToListAsync();

            return _mapper.Map<List<WorkoutSessionDto>>(sessions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error retrieving sessions for member {memberId}");
            return new List<WorkoutSessionDto>();
        }
    }

    public async Task<bool> StartExercise(string sessionId, int exerciseId)
    {
        try
        {
            var exerciseProgress = await GetExerciseProgress(sessionId, exerciseId);
            if (exerciseProgress == null || exerciseProgress.Status != ExerciseStatus.NotStarted)
                return false;

            exerciseProgress.Status = ExerciseStatus.InProgress;
            exerciseProgress.StartTime = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error starting exercise {exerciseId} in session {sessionId}");
            return false;
        }
    }

    public async Task<bool> CompleteExercise(string sessionId, int exerciseId)
    {
        try
        {
            var exerciseProgress = await GetExerciseProgress(sessionId, exerciseId);
            if (exerciseProgress == null)
                return false;

            exerciseProgress.Status = ExerciseStatus.Completed;
            exerciseProgress.EndTime = DateTime.UtcNow;
            
            if (exerciseProgress.StartTime.HasValue)
            {
                var duration = (exerciseProgress.EndTime.Value - exerciseProgress.StartTime.Value).TotalSeconds;
                exerciseProgress.TotalTimeSeconds = (int)duration;
            }

            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error completing exercise {exerciseId} in session {sessionId}");
            return false;
        }
    }

    public async Task<bool> SkipExercise(string sessionId, int exerciseId)
    {
        try
        {
            var exerciseProgress = await GetExerciseProgress(sessionId, exerciseId);
            if (exerciseProgress == null)
                return false;

            exerciseProgress.Status = ExerciseStatus.Skipped;
            exerciseProgress.EndTime = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error skipping exercise {exerciseId} in session {sessionId}");
            return false;
        }
    }

    public async Task<bool> StartSet(string sessionId, int exerciseId, int setNumber)
    {
        try
        {
            var setProgress = await GetSetProgress(sessionId, exerciseId, setNumber);
            if (setProgress == null || setProgress.Status != SetStatus.NotStarted)
                return false;

            setProgress.Status = SetStatus.InProgress;
            setProgress.StartTime = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error starting set {setNumber} for exercise {exerciseId} in session {sessionId}");
            return false;
        }
    }

    public async Task<bool> CompleteSet(string sessionId, int exerciseId, int setNumber, UpdateSessionSetProgressDto setDto)
    {
        try
        {
            var setProgress = await GetSetProgress(sessionId, exerciseId, setNumber);
            if (setProgress == null)
                return false;

            _mapper.Map(setDto, setProgress);
            setProgress.Status = SetStatus.Completed;
            setProgress.EndTime = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error completing set {setNumber} for exercise {exerciseId} in session {sessionId}");
            return false;
        }
    }

    public async Task<bool> UpdateExerciseProgress(string sessionId, int exerciseId, UpdateSessionExerciseProgressDto progressDto)
    {
        try
        {
            var exerciseProgress = await GetExerciseProgress(sessionId, exerciseId);
            if (exerciseProgress == null)
                return false;

            _mapper.Map(progressDto, exerciseProgress);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error updating exercise progress for exercise {exerciseId} in session {sessionId}");
            return false;
        }
    }

    public async Task<bool> UpdateSetProgress(string sessionId, int exerciseId, int setNumber, UpdateSessionSetProgressDto setDto)
    {
        try
        {
            var setProgress = await GetSetProgress(sessionId, exerciseId, setNumber);
            if (setProgress == null)
                return false;

            _mapper.Map(setDto, setProgress);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error updating set progress for set {setNumber}, exercise {exerciseId} in session {sessionId}");
            return false;
        }
    }

    public async Task<bool> SessionExists(string sessionId)
    {
        return await _context.Get<WorkoutSession>().AnyAsync(s => s.Id == sessionId);
    }

    public async Task<bool> IsSessionActive(string sessionId)
    {
        var session = await _context.Get<WorkoutSession>().FirstOrDefaultAsync(s => s.Id == sessionId);
        return session?.Status == SessionStatus.Active || session?.Status == SessionStatus.Paused;
    }

    public async Task<bool> IsSessionOwnedByMember(string sessionId, int memberId)
    {
        var session = await _context.Get<WorkoutSession>().FirstOrDefaultAsync(s => s.Id == sessionId);
        return session?.MemberId == memberId;
    }

    public async Task<int> CleanupAbandonedSessions(TimeSpan olderThan)
    {
        try
        {
            var cutoffDate = DateTime.UtcNow - olderThan;
            var abandonedSessions = await _context.Get<WorkoutSession>()
                .Where(s => (s.Status == SessionStatus.Active || s.Status == SessionStatus.Paused) &&
                           s.CreatedDate < cutoffDate)
                .ToListAsync();

            foreach (var session in abandonedSessions)
            {
                session.Status = SessionStatus.Abandoned;
                session.EndTime = DateTime.UtcNow;
                session.ModifiedDate = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            _logger.LogInformation($"Cleaned up {abandonedSessions.Count} abandoned sessions");
            return abandonedSessions.Count;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cleaning up abandoned sessions");
            return 0;
        }
    }

    // Private helper methods
    private async Task<WorkoutSession?> GetSessionEntity(string sessionId)
    {
        return await _context.Get<WorkoutSession>()
            .Include(s => s.ExerciseProgress)
                .ThenInclude(ep => ep.Sets)
            .FirstOrDefaultAsync(s => s.Id == sessionId);
    }

    private async Task<SessionExerciseProgress?> GetExerciseProgress(string sessionId, int exerciseId)
    {
        return await _context.Get<SessionExerciseProgress>()
            .Include(ep => ep.Sets)
            .FirstOrDefaultAsync(ep => ep.SessionId == sessionId && ep.ExerciseId == exerciseId);
    }

    private async Task<SessionSetProgress?> GetSetProgress(string sessionId, int exerciseId, int setNumber)
    {
        return await _context.Get<SessionSetProgress>()
            .FirstOrDefaultAsync(sp => sp.ExerciseProgress.SessionId == sessionId &&
                                      sp.ExerciseProgress.ExerciseId == exerciseId &&
                                      sp.SetNumber == setNumber);
    }

    private string CalculateWorkoutResult(WorkoutSession session)
    {
        // Calculate a result based on session data
        // This could be total weight lifted, time taken, exercises completed, etc.
        var completedExercises = session.ExerciseProgress.Count(ep => ep.Status == ExerciseStatus.Completed);
        var totalExercises = session.ExerciseProgress.Count();
        
        return $"{completedExercises}/{totalExercises} exercises completed";
    }
}