using FitBuddy.Services.Dtos.Comments;
using FitBuddy.Services.Dtos.Pagination;

namespace FitBuddy.Services.Interfaces;

public interface ICommentService
{
    Task<PaginatedDto<CommentDto>> RetrieveComments(PaginationDto pagination, int? workoutId);
    // Task<string> RetrieveComment(int commentId);
    // Task<string> CreateComment(string comment);
    // Task<string> UpdateComment(int commentId, string comment);
    // Task<string> DeleteComment(int commentId);
}