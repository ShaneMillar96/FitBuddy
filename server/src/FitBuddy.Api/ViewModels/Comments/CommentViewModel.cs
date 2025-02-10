using FitBuddy.Api.ViewModels.Members;

namespace FitBuddy.Api.ViewModels.Comments;

public class CommentViewModel
{
    public int Id { get; set; }
    
    public string Description { get; set; }
    
    public MemberViewModel Member { get; set; }
}