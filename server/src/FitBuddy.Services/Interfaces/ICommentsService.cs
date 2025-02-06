namespace FitBuddy.Services.Interfaces;

public interface ICommentsService
{
    Task<string[]> RetrieveComments();
    Task<string> RetrieveComment(int commentId);
    Task<string> CreateComment(string comment);
    Task<string> UpdateComment(int commentId, string comment);
    Task<string> DeleteComment(int commentId);
}