using AutoMapper;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Dal.Models.application;
using FitBuddy.Dal.Specifications.Comments;
using FitBuddy.Services.Dtos.Comments;
using FitBuddy.Services.Dtos.Pagination;
using FitBuddy.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Unosquare.EntityFramework.Specification.Common.Extensions;

namespace FitBuddy.Services.Services;

public class CommentService : ICommentService
{
    private readonly IFitBudContext _context;
    private readonly IPaginationService _paginationService;
    private readonly IMapper _mapper;
    
    public CommentService(IFitBudContext context, IPaginationService paginationService, IMapper mapper)
    {
        (_context, _paginationService, _mapper) = (context, paginationService,  mapper);
    }
    
    public async Task<PaginatedDto<CommentDto>> RetrieveComments(PaginationDto pagination, int? workoutId)
    {
        var (pageSize, pageNumber, searchQuery, sortBy, ascending) = pagination;

        var query = _context
            .Get<Comment>()
            .Include(x => x.Workout)
            .Include(x => x.CreatedBy)
            .Where(new CommentsByWorkoutIdSpec(workoutId));


        var comments = _mapper
            .ProjectTo<CommentDto>(query)
            .OrderByDescending(x => x.CreatedDate);

        return await _paginationService.CreatePaginatedResponseAsync(comments, pageSize, pageNumber);
    }
    
    public async Task<CommentDto?> RetrieveComment(int id) =>
        await _mapper.ProjectTo<CommentDto>(_context
                .Get<Comment>()
                .Where(new CommentByIdSpec(id)))
            .SingleOrDefaultAsync();

    public async Task<int> CreateComment(CreateCommentDto comment)
    {
        var newComment = _mapper.Map<Comment>(comment); 
        
        await _context.AddAsync(newComment);
        await _context.SaveChangesAsync();

        return newComment.Id;
    }
    
    public async Task<bool> UpdateComment(int id, UpdateCommentDto comment)
    {
        var currentComment = _context
            .Get<Comment>()
            .FirstOrDefault(new CommentByIdSpec(id));

        if (currentComment == null) return false;

        _mapper.Map(comment, currentComment);
        await _context.SaveChangesAsync();
        return true;
    }
    
    public async Task<bool> DeleteComment(int id)
    {
        var comment = _context
            .Get<Comment>()
            .FirstOrDefault(new CommentByIdSpec(id));

        if (comment == null) return false;
        
        _context.Delete(comment);
        await _context.SaveChangesAsync();
        return true;
    }
}