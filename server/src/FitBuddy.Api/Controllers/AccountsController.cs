using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using FitBuddy.Api.RequestModels.Members;
using FitBuddy.Services.Dtos.Members;
using FitBuddy.Services.Interfaces;

namespace FitBuddy.Api.Controllers;

[ApiController]
[Route("accounts")]
public class AccountsController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IAccountService _service;

    public AccountsController(IMapper mapper, IAccountService service)
    {
        (_mapper, _service) = (mapper, service);
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register([FromBody] RegisterMemberRequestModel model)
    {
        var result = await _service.RegisterAsync(_mapper.Map<RegisterMemberDto>(model));

        if (result.Succeeded)
        {
            return Created("Member registered", model.Username);
        }

        return BadRequest(result.Errors);
    }

    [HttpPost("login")]
    public async Task<ActionResult> Login([FromBody] LoginMemberRequestModel model)
    {
        var result = await _service.LoginAsync(_mapper.Map<LoginMemberDto>(model));

        if (result.Succeeded)
        {
            return Ok("Login successful");
        }

        return Unauthorized("Invalid login attempt");
    }
}