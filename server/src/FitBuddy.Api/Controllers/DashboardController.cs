using AutoMapper;
using FitBuddy.Api.Controllers.Base;
using FitBuddy.Api.ViewModels.Dashboard;
using FitBuddy.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitBuddy.Api.Controllers;

[ApiController]
[Route("dashboard")]
[Authorize]
public class DashboardController : FitBuddyBaseController
{
    private readonly IMapper _mapper;
    private readonly IMemberService _memberService;

    public DashboardController(IMapper mapper, IMemberService memberService)
    {
        _mapper = mapper;
        _memberService = memberService;
    }

    [HttpGet]
    public async Task<ActionResult> GetDashboard()
    {
        var dashboard = await _memberService.GetMemberDashboardAsync();
        return Ok(_mapper.Map<DashboardViewModel>(dashboard));
    }


}