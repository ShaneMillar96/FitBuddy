using AutoMapper;
using FitBuddy.Api.Controllers.Base;
using FitBuddy.Api.RequestModels.Exercises;
using FitBuddy.Api.ViewModels.Exercises;
using FitBuddy.Api.ViewModels.Pagination;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Services.Dtos.Exercises;
using FitBuddy.Services.Dtos.Pagination;
using FitBuddy.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitBuddy.Api.Controllers;

[ApiController]
[Route("exercises")]
public class ExercisesController : FitBuddyBaseController
{
    private readonly IMapper _mapper;
    private readonly IExerciseService _exerciseService;

    public ExercisesController(IMapper mapper, IExerciseService exerciseService, IFitBudContext context)
        : base(context)
    {
        _mapper = mapper;
        _exerciseService = exerciseService;
    }

    [HttpGet]
    public async Task<ActionResult> GetExercises(
        [FromQuery] PaginationDto pagination,
        [FromQuery] int? categoryId = null,
        [FromQuery] string? muscleGroup = null,
        [FromQuery] string? equipment = null)
    {
        var exercises = await _exerciseService.GetExercisesAsync(pagination, categoryId, muscleGroup, equipment);
        return OkOrNoContent(_mapper.Map<PaginatedViewModel<ExerciseViewModel>>(exercises));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetExercise(int id)
    {
        var exercise = await _exerciseService.GetExerciseByIdAsync(id);
        return OkOrNoContent(_mapper.Map<ExerciseViewModel>(exercise));
    }

    [HttpGet("category/{categoryId}")]
    public async Task<ActionResult> GetExercisesByCategory(int categoryId)
    {
        var exercises = await _exerciseService.GetExercisesByCategoryAsync(categoryId);
        return OkOrNoContent(_mapper.Map<List<ExerciseViewModel>>(exercises));
    }

    [HttpGet("category/{categoryId}/subtype")]
    public async Task<ActionResult> GetExercisesByCategoryAndSubType(int categoryId, [FromQuery] string? subTypeName = null)
    {
        var exercises = await _exerciseService.GetExercisesByCategoryAndSubTypeAsync(categoryId, subTypeName);
        return OkOrNoContent(_mapper.Map<List<ExerciseViewModel>>(exercises));
    }

    [HttpGet("search")]
    public async Task<ActionResult> SearchExercises([FromQuery] string searchTerm, [FromQuery] int? categoryId = null)
    {
        if (string.IsNullOrWhiteSpace(searchTerm) || searchTerm.Length < 2)
        {
            return BadRequest("Search term must be at least 2 characters long");
        }

        var exercises = await _exerciseService.SearchExercisesAsync(searchTerm, categoryId);
        return OkOrNoContent(_mapper.Map<List<ExerciseViewModel>>(exercises));
    }

    [HttpGet("muscle-groups")]
    public async Task<ActionResult> GetMuscleGroups()
    {
        var muscleGroups = await _exerciseService.GetMuscleGroupsAsync();
        return OkOrNoContent(muscleGroups);
    }

    [HttpGet("equipment-types")]
    public async Task<ActionResult> GetEquipmentTypes()
    {
        var equipmentTypes = await _exerciseService.GetEquipmentTypesAsync();
        return OkOrNoContent(equipmentTypes);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult> CreateExercise([FromBody] CreateExerciseRequestModel request)
    {
        var dto = _mapper.Map<CreateExerciseDto>(request);
        var exerciseId = await _exerciseService.CreateExerciseAsync(dto);
        return Created("Exercise created", exerciseId);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateExercise(int id, [FromBody] UpdateExerciseRequestModel request)
    {
        var dto = _mapper.Map<UpdateExerciseDto>(request);
        var updated = await _exerciseService.UpdateExerciseAsync(id, dto);

        if (updated) return Ok();
        return NotFound($"Exercise with id {id} not found");
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteExercise(int id)
    {
        var deleted = await _exerciseService.DeleteExerciseAsync(id);

        if (deleted) return NoContent();
        return BadRequest("Cannot delete exercise that is in use or does not exist");
    }
}