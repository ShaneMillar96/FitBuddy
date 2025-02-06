using FitBuddy.Api.Controllers.Base;
using FitBuddy.Api.ViewModels.Pagination;
using FitBuddy.Services.Dtos.Pagination;
using FitBuddy.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using FitBuddy.Api.ViewModels.Members;

namespace FitBuddy.Api.Controllers;

[ApiController]
[Route("members")]
public class MembersController : FitBuddyBaseController
{
    private readonly IMapper _mapper;
    private readonly IMemberService _service;
    
    public MembersController(IMapper mapper, IMemberService service)
    {
        (_mapper, _service) = (mapper, service);
    }
    
    [HttpGet]
    public async Task<ActionResult> GetMembers([FromQuery] PaginationDto pagination)
    {
        var members = await _service.RetrieveMembers(pagination);
        var viewModel = _mapper.Map<PaginatedViewModel<MemberViewModel>>(members);

        return OkOrNoContent(viewModel);
    }
    
    [HttpGet("{id}")]
    public ActionResult GetMember(int id)
    {
        return OkOrNoContent(new { Member = "Alice" });
    }
    
    [HttpPost]
    public ActionResult CreateMember([FromBody] string member)
    {
        return Created("Member created", member);
    }
    
    [HttpPut("{id}")]
    public ActionResult UpdateMember(int id, [FromBody] string member)
    {
        return Ok(member);
    }
    
    [HttpDelete("{id}")]
    public ActionResult DeleteMember(int id)
    {
        return NoContent();
    }
}