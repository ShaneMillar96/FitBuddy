using AutoMapper;
using FitBuddy.Api.Controllers.Base;
using FitBuddy.Api.RequestModels.Comments;
using FitBuddy.Api.ViewModels.Comments;
using FitBuddy.Api.ViewModels.Pagination;
using FitBuddy.Services.Dtos.Comments;
using FitBuddy.Services.Dtos.Pagination;
using FitBuddy.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FitBuddy.Api.Controllers;

[ApiController]
[Route("comments")]
public class CommentsController : FitBuddyBaseController
{
    private readonly IMapper _mapper;
    private readonly ICommentService _service;
    
    public CommentsController(IMapper mapper, ICommentService service)
    {
        (_mapper, _service) = (mapper, service);
    }
    
    [HttpGet]
    public async Task<ActionResult> GetComments([FromQuery] PaginationDto pagination, [FromQuery] int? workoutId)
    {
        var comments = await _service.RetrieveComments(pagination, workoutId);
        return OkOrNoContent(_mapper.Map<PaginatedViewModel<CommentViewModel>>(comments));
    }
    
    [HttpGet("{id}")]
    public async  Task<ActionResult> GetComment(int id)
    {
        var comment = await _service.RetrieveComment(id);
        return OkOrNoContent(_mapper.Map<CommentViewModel>(comment));
    }
    
    [HttpPost]
    public async Task<ActionResult> CreateComment([FromBody] CreateCommentRequestModel comment)
    {
        var commentId = await _service.CreateComment(_mapper.Map<CreateCommentDto>(comment));

        return Created("Comment created", comment);
    }
    
    [HttpPut("{id}")]
    public ActionResult UpdateComment(int id, [FromBody] string comment)
    {
        return Ok(comment);
    }
    
    [HttpDelete("{id}")]
    public ActionResult DeleteComment(int id)
    {
        return NoContent();
    }
}