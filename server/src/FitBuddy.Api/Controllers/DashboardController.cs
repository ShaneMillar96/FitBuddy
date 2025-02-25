using AutoMapper;
using FitBuddy.Api.Controllers.Base;
using FitBuddy.Api.ViewModels.Dashboard;
using FitBuddy.Dal.Interfaces;
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
    private readonly IDashboardService _dashboardService;

    public DashboardController(IMapper mapper, IDashboardService dashboardService, IFitBudContext context) : base(context)
    {
        _mapper = mapper;
        _dashboardService = dashboardService;
    }

    [HttpGet]
    public async Task<ActionResult> GetDashboard()
    {
        var currentUser = GetCurrentUserId();
        var dashboard = await _dashboardService.GetMemberDashboardAsync(currentUser);
        return Ok(_mapper.Map<DashboardViewModel>(dashboard));
    }
}