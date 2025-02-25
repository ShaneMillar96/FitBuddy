using FitBuddy.Services.Dtos.Workouts;

namespace FitBuddy.Services.Interfaces;

public interface IGarminService
{
    Task<List<GarminActivityDto>> GetGarminActivitiesAsync(string accessToken);
}