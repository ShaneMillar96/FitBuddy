using System.Text.Json;
using AutoMapper;
using FitBuddy.Api.Controllers.Base;
using FitBuddy.Api.RequestModels.Members;
using FitBuddy.Api.ResponseModels;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Services.Dtos.Members;
using FitBuddy.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitBuddy.Api.Controllers
{
    [ApiController]
    [Route("account")]
    public class AccountController : FitBuddyBaseController
    {
        private readonly IMapper _mapper;
        private readonly IAccountService _accountService;
        private readonly IGarminService _garminService;
        private readonly IConfiguration _configuration;

        public AccountController(
            IMapper mapper,
            IAccountService accountService,
            IGarminService garminService,
            IFitBudContext context,
            IConfiguration configuration)
            : base(context)
        {
            _mapper = mapper;
            _accountService = accountService;
            _garminService = garminService;
            _configuration = configuration;
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

        [HttpGet("garmin-auth")]
        public IActionResult GarminAuth()
        {
            var clientId = _configuration["Garmin:ClientId"];
            var redirectUri = _configuration["Garmin:RedirectUri"];
            var authUrl = $"https://connect.garmin.com/oauth/authorize?client_id={clientId}&redirect_uri={Uri.EscapeDataString(redirectUri)}&response_type=code&scope=activity:read";
            return Redirect(authUrl);
        }

        [HttpGet("garmin-callback")]
        public async Task<IActionResult> GarminCallback(string code)
        {
            var client = new HttpClient();
            var clientId = _configuration["Garmin:ClientId"];
            var clientSecret = _configuration["Garmin:ClientSecret"];
            var redirectUri = _configuration["Garmin:RedirectUri"];

            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("grant_type", "authorization_code"),
                new KeyValuePair<string, string>("code", code),
                new KeyValuePair<string, string>("client_id", clientId),
                new KeyValuePair<string, string>("client_secret", clientSecret),
                new KeyValuePair<string, string>("redirect_uri", redirectUri)
            });

            var response = await client.PostAsync("https://connectapi.garmin.com/oauth-service/oauth/token", content);
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync();
            var tokenData = JsonSerializer.Deserialize<GarminTokenResponse>(jsonResponse, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            var accessToken = tokenData?.AccessToken;

            if (string.IsNullOrEmpty(accessToken))
            {
                return BadRequest("Failed to retrieve Garmin access token.");
            }

            await SaveGarminAccessTokenAsync(accessToken);

            return Ok(new { AccessToken = accessToken });
        }

        [HttpGet("garmin-activities")]
        [Authorize]
        public async Task<ActionResult> GetGarminActivities()
        {
            var accessToken = await GetGarminAccessTokenAsync();
            if (string.IsNullOrEmpty(accessToken))
            {
                return Unauthorized("No Garmin access token found for this user.");
            }

            var activities = await _garminService.GetGarminActivitiesAsync(accessToken);
            return Ok(activities);
        }
    }
}