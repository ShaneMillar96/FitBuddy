using FitBuddy.Services.Dtos.Members;

namespace FitBuddy.Services.Dtos.Comments;

public class CommentDto
{
    public int Id { get; set; }
    
    public string Description { get; set; }
    
    public DateTime CreatedDate { get; set; }
    
    public MemberDto Member { get; set; }
}