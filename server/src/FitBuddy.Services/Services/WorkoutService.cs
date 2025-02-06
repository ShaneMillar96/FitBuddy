using AutoMapper;
using FitBuddy.Dal.Extensions;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Dal.Models.application;
using FitBuddy.Dal.Specifications.Workouts;
using FitBuddy.Services.Dtos.Pagination;
using FitBuddy.Services.Dtos.Workouts;
using FitBuddy.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Unosquare.EntityFramework.Specification.Common.Extensions;

namespace FitBuddy.Services.Services;

public class WorkoutService : IWorkoutService
{
    private readonly IFitBudContext _context;
    private readonly IPaginationService _paginationService;
    private readonly IMapper _mapper;
    
    public WorkoutService(IFitBudContext context, IPaginationService paginationService, IMapper mapper)
    {
        (_context, _paginationService, _mapper) = (context, paginationService,  mapper);
    }
    
    public async Task<PaginatedDto<WorkoutDto>> RetrieveWorkouts(PaginationDto pagination)
    {
        var (pageSize, pageNumber, searchQuery, sortBy, ascending) = pagination;
        
        var query = _context
            .Get<Workout>()
            .Include(x => x.CreatedByNavigation)
            .Include(x => x.WorkoutType)
            .Where(new WorkoutBySearchSpec(searchQuery));

        var workouts = _mapper
            .ProjectTo<WorkoutDto>(query)
            .OrderBy(sortBy, ascending);

        return await _paginationService.CreatePaginatedResponseAsync(workouts, pageSize, pageNumber);
    }
    
}