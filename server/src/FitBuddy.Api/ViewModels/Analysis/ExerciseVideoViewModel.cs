namespace FitBuddy.Api.ViewModels.Analysis;

public class ExerciseVideoViewModel
{
    public int Id { get; set; }
    public int MemberId { get; set; }
    public string FilePath { get; set; } = string.Empty;
    public string ExerciseType { get; set; } = string.Empty;
    public string? AnalysisResult { get; set; }
    public DateTime? CreatedDate { get; set; }
}