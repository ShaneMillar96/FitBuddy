using FitBuddy.Api.Controllers.Base;
using FitBuddy.Api.ViewModels.Pagination;
using FitBuddy.Services.Dtos.Pagination;
using FitBuddy.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using FitBuddy.Api.RequestModels.Members;
using FitBuddy.Api.ViewModels.Members;
using FitBuddy.Services.Dtos.Members;

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
        return OkOrNoContent(_mapper.Map<PaginatedViewModel<MemberViewModel>>(members));
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult> GetMember(int id)
    {
        var member = await _service.RetrieveMember(id);
        return OkOrNoContent(_mapper.Map<MemberViewModel>(member));
    }
    
    [HttpPost]
    public async Task<ActionResult> CreateMember([FromBody] CreateMemberRequestModel member)
    {
        var memberId = await _service.CreateMember(_mapper.Map<CreateMemberDto>(member));

        return Created("Member created", memberId);
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