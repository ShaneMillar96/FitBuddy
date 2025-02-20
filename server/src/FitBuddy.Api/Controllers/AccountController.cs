using AutoMapper;
using FitBuddy.Api.RequestModels.Members;
using FitBuddy.Services.Dtos.Members;
using FitBuddy.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FitBuddy.Api.Controllers
{
    [ApiController]
    [Route("account")]
    public class AccountController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IAccountService _accountService;

        public AccountController(IMapper mapper, IAccountService accountService)
        {
            (_mapper, _accountService) = (mapper, accountService);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterMemberRequestModel request)
        {
            try
            {
                var member = await _accountService.RegisterAsync(_mapper.Map<RegisterMemberDto>(request));
                return Ok(new { member.Id, member.Username, member.Email });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginMemberRequestModel request)
        {
            var token = await _accountService.LoginAsync(_mapper.Map<LoginMemberDto>(request));
            if (token == null)
                return Unauthorized(new { message = "Invalid credentials" });

            return Ok(new { token });
        }
    }
}