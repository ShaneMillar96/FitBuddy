namespace FitBuddy.Services.Client.ResponseModels;

public class GarminActivityResponse
{
    public string ActivityId { get; set; }
    public string ActivityName { get; set; }
    public int DurationInSeconds { get; set; }
    public int AverageHeartRateInBeatsPerMinute { get; set; }
    public int Calories { get; set; }
    public string StartTimeInSeconds { get; set; }
}