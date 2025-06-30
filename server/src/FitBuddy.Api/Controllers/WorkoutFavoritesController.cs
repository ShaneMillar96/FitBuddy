using AutoMapper;
using FitBuddy.Api.Controllers.Base;
using FitBuddy.Api.RequestModels.Workouts;
using FitBuddy.Api.ViewModels.Workouts;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitBuddy.Api.Controllers;

[ApiController]
[Route("favorites")]
[Authorize]
public class WorkoutFavoritesController : FitBuddyBaseController
{
    private readonly IMapper _mapper;
    private readonly IWorkoutFavoriteService _workoutFavoriteService;

    public WorkoutFavoritesController(
        IMapper mapper, 
        IWorkoutFavoriteService workoutFavoriteService, 
        IFitBudContext context) : base(context)
    {
        _mapper = mapper;
        _workoutFavoriteService = workoutFavoriteService;
    }

    /// <summary>
    /// Toggle favorite status for a workout
    /// </summary>
    /// <param name="workoutId">The ID of the workout to toggle favorite status</param>
    /// <returns>The updated favorite status and total favorites count</returns>
    [HttpPost("{workoutId:int}")]
    public async Task<ActionResult<ToggleFavoriteResultViewModel>> ToggleFavorite(int workoutId)
    {
        var currentUser = GetCurrentUserId();
        var result = await _workoutFavoriteService.ToggleFavoriteAsync(currentUser, workoutId);
        return Ok(_mapper.Map<ToggleFavoriteResultViewModel>(result));
    }

    /// <summary>
    /// Check if a workout is favorited by the current user
    /// </summary>
    /// <param name="workoutId">The ID of the workout to check</param>
    /// <returns>True if the workout is favorited, false otherwise</returns>
    [HttpGet("{workoutId:int}/status")]
    public async Task<ActionResult<bool>> IsFavorite(int workoutId)
    {
        var currentUser = GetCurrentUserId();
        var isFavorite = await _workoutFavoriteService.IsFavoriteAsync(currentUser, workoutId);
        return Ok(isFavorite);
    }

    /// <summary>
    /// Get all favorite workouts for the current user
    /// </summary>
    /// <returns>List of favorite workouts</returns>
    [HttpGet]
    public async Task<ActionResult<List<WorkoutFavoriteViewModel>>> GetFavorites()
    {
        var currentUser = GetCurrentUserId();
        var favorites = await _workoutFavoriteService.GetMemberFavoritesAsync(currentUser);
        return Ok(_mapper.Map<List<WorkoutFavoriteViewModel>>(favorites));
    }

    /// <summary>
    /// Get the total number of favorites for a specific workout
    /// </summary>
    /// <param name="workoutId">The ID of the workout</param>
    /// <returns>The total number of favorites</returns>
    [HttpGet("{workoutId:int}/count")]
    public async Task<ActionResult<int>> GetFavoriteCount(int workoutId)
    {
        var count = await _workoutFavoriteService.GetFavoriteCountAsync(workoutId);
        return Ok(count);
    }

    /// <summary>
    /// Get the total number of favorites for the current user
    /// </summary>
    /// <returns>The total number of workouts favorited by the user</returns>
    [HttpGet("my-count")]
    public async Task<ActionResult<int>> GetMyFavoriteCount()
    {
        var currentUser = GetCurrentUserId();
        var count = await _workoutFavoriteService.GetMemberFavoriteCountAsync(currentUser);
        return Ok(count);
    }
}