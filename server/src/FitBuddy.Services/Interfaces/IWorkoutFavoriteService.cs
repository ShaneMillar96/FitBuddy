using FitBuddy.Services.Dtos.Workouts;

namespace FitBuddy.Services.Interfaces;

public interface IWorkoutFavoriteService
{
    Task<ToggleFavoriteResultDto> ToggleFavoriteAsync(int memberId, int workoutId);
    Task<bool> IsFavoriteAsync(int memberId, int workoutId);
    Task<List<WorkoutFavoriteDto>> GetMemberFavoritesAsync(int memberId);
    Task<int> GetFavoriteCountAsync(int workoutId);
    Task<int> GetMemberFavoriteCountAsync(int memberId);
}