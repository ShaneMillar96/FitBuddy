using FitBuddy.Services.Dtos.Comments;
using FitBuddy.Services.Dtos.Pagination;

namespace FitBuddy.Services.Interfaces;

public interface ICommentService
{
    Task<PaginatedDto<CommentDto>> RetrieveComments(PaginationDto pagination, int? workoutId);
     Task<CommentDto?> RetrieveComment(int commentId);
     Task<int> CreateComment(CreateCommentDto comment);
     Task<bool> UpdateComment(int id, UpdateCommentDto comment);
     Task<bool> DeleteComment(int commentId);
}