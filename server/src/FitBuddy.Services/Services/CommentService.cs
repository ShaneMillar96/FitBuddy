using AutoMapper;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Dal.Models.application;
using FitBuddy.Dal.Specifications.Comments;
using FitBuddy.Services.Dtos.Comments;
using FitBuddy.Services.Dtos.Pagination;
using FitBuddy.Services.Dtos.Workouts;
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
            .Include(x => x.Member)
            .Where(new CommentsByWorkoutIdSpec(workoutId));


        var comments = _mapper
            .ProjectTo<CommentDto>(query)
            .OrderBy(x => x.CreatedDate);

        return await _paginationService.CreatePaginatedResponseAsync(comments, pageSize, pageNumber);
    }
}