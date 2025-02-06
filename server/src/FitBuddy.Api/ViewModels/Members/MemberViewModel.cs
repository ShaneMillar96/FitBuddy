namespace FitBuddy.Api.ViewModels.Members;

public class MemberViewModel
{
    public int Id { get; set; }
    
    public string Username { get; set; } = null!;
    
    public string Email { get; set; } = null!;
    
    public DateTime CreatedDate { get; set; }
    
    public DateTime? ModifiedDate { get; set; }
}