namespace FitBuddy.Api.RequestModels.Comments;

public class CreateCommentRequestModel
{
    public int WorkoutId { get; set; }
    public string Comment { get; set; }
}