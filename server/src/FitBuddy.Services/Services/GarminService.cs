using System.Net.Http.Headers;
using System.Text.Json;
using FitBuddy.Services.Client.ResponseModels;
using FitBuddy.Services.Dtos.Workouts;
using FitBuddy.Services.Interfaces;

namespace FitBuddy.Services.Services;

public class GarminService : IGarminService
{
    private readonly IHttpClientFactory _httpClientFactory; 
    
    public GarminService( IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<List<GarminActivityDto>> GetGarminActivitiesAsync(string accessToken)
    {
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        var response = await client.GetAsync("https://connectapi.garmin.com/activity-service/activity/user-activities");
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        var activities = JsonSerializer.Deserialize<List<GarminActivityResponse>>(json);
        
        return activities?.Select(a => new GarminActivityDto
        {
            ActivityId = a.ActivityId,
            Name = a.ActivityName,
            Duration = a.DurationInSeconds,
            AvgHeartRate = a.AverageHeartRateInBeatsPerMinute,
            CaloriesBurned = a.Calories,
            StartTime = DateTime.Parse(a.StartTimeInSeconds)
        }).ToList() ?? new List<GarminActivityDto>();
    }
}