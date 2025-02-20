using FitBuddy.Services.Dtos.Members;
using Microsoft.AspNetCore.Identity;

namespace FitBuddy.Services.Interfaces;

public interface IAccountService
{
    Task<IdentityResult> RegisterAsync(RegisterMemberDto model);
    Task<SignInResult> LoginAsync(LoginMemberDto model);
}