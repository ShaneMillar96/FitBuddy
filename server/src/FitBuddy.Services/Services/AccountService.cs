// AccountsService.cs
using Microsoft.AspNetCore.Identity;
using AutoMapper;
using FitBuddy.Dal.Models.application;
using FitBuddy.Services.Dtos.Members;
using FitBuddy.Services.Interfaces;

namespace FitBuddy.Api.Services;

public class AccountService : IAccountService
{
    private readonly IMapper _mapper;
    private readonly UserManager<Member> _userManager;
    private readonly SignInManager<Member> _signInManager;

    public AccountService(IMapper mapper, UserManager<Member> userManager, SignInManager<Member> signInManager)
    {
        (_mapper, _userManager, _signInManager) = (mapper, userManager, signInManager);
    }

    public async Task<IdentityResult> RegisterAsync(RegisterMemberDto model)
    {
        var member = _mapper.Map<Member>(model);
        return await _userManager.CreateAsync(member, model.Password);
    }

    public async Task<SignInResult> LoginAsync(LoginMemberDto model)
    {
        var user = await _userManager.FindByNameAsync(model.Username);
        
        return await _signInManager.PasswordSignInAsync(model.Username, model.Password, isPersistent: false,
            lockoutOnFailure: false);
        
    }
}