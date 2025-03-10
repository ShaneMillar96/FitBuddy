namespace FitBuddy.Api.RequestModels.Members;

public class CreateMemberRequestModel
{
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
}