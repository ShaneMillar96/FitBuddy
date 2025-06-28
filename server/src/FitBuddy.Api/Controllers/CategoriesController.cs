using AutoMapper;
using FitBuddy.Api.Controllers.Base;
using FitBuddy.Api.RequestModels.Categories;
using FitBuddy.Api.ViewModels.Categories;
using FitBuddy.Api.ViewModels.Pagination;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Services.Dtos.Categories;
using FitBuddy.Services.Dtos.Pagination;
using FitBuddy.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitBuddy.Api.Controllers;

[ApiController]
[Route("categories")]
public class CategoriesController : FitBuddyBaseController
{
    private readonly IMapper _mapper;
    private readonly ICategoryService _categoryService;

    public CategoriesController(IMapper mapper, ICategoryService categoryService, IFitBudContext context) 
        : base(context)
    {
        _mapper = mapper;
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<ActionResult> GetCategories()
    {
        var categories = await _categoryService.GetAllCategoriesAsync();
        return OkOrNoContent(_mapper.Map<List<WorkoutCategoryViewModel>>(categories));
    }

    [HttpGet("paginated")]
    public async Task<ActionResult> GetCategoriesPaginated([FromQuery] PaginationDto pagination)
    {
        var categories = await _categoryService.GetCategoriesPaginatedAsync(pagination);
        return OkOrNoContent(_mapper.Map<PaginatedViewModel<WorkoutCategoryViewModel>>(categories));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetCategory(int id)
    {
        var category = await _categoryService.GetCategoryByIdAsync(id);
        return OkOrNoContent(_mapper.Map<WorkoutCategoryViewModel>(category));
    }

    [HttpGet("{categoryId}/sub-types")]
    public async Task<ActionResult> GetSubTypes(int categoryId)
    {
        var subTypes = await _categoryService.GetSubTypesByCategoryAsync(categoryId);
        return OkOrNoContent(_mapper.Map<List<WorkoutSubTypeViewModel>>(subTypes));
    }

    [HttpGet("sub-types/{id}")]
    public async Task<ActionResult> GetSubType(int id)
    {
        var subType = await _categoryService.GetSubTypeByIdAsync(id);
        return OkOrNoContent(_mapper.Map<WorkoutSubTypeViewModel>(subType));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult> CreateCategory([FromBody] CreateWorkoutCategoryRequestModel request)
    {
        var dto = _mapper.Map<CreateWorkoutCategoryDto>(request);
        var categoryId = await _categoryService.CreateCategoryAsync(dto);
        return Created("Category created", categoryId);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateCategory(int id, [FromBody] UpdateWorkoutCategoryRequestModel request)
    {
        var dto = _mapper.Map<UpdateWorkoutCategoryDto>(request);
        var updated = await _categoryService.UpdateCategoryAsync(id, dto);
        
        if (updated) return Ok();
        return NotFound($"Category with id {id} not found");
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCategory(int id)
    {
        var deleted = await _categoryService.DeleteCategoryAsync(id);
        
        if (deleted) return NoContent();
        return BadRequest("Cannot delete category that is in use or does not exist");
    }
}