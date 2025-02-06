namespace FitBuddy.Services.Dtos.Members;

public class MemberDto
{
    public int Id { get; set; }
    
    public string Username { get; set; }

    public string Email { get; set; }
    
    public DateTime CreatedDate { get; set; }
    
    public DateTime? ModifiedDate { get; set; }
}