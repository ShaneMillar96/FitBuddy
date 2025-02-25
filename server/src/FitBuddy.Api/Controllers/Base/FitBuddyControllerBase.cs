using FitBuddy.Dal.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using FitBuddy.Dal.Models.application;
using Microsoft.EntityFrameworkCore;

namespace FitBuddy.Api.Controllers.Base
{
    public abstract class FitBuddyControllerBase : ControllerBase
    {
        private readonly IFitBudContext _context;

        protected FitBuddyControllerBase(IFitBudContext context)
        {
            _context = context;
        }

        protected int GetCurrentUserId()
        {
            var user = HttpContext.User;
            if (user == null || !user.Identity.IsAuthenticated) return 0;

            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null && int.TryParse(userIdClaim.Value, out var userId) ? userId : 0;
        }

        protected async Task SaveGarminAccessTokenAsync(string accessToken)
        {
            var userId = GetCurrentUserId();
            if (userId == 0) throw new UnauthorizedAccessException("User not authenticated.");

            var member = await _context.Get<Member>().FirstOrDefaultAsync(m => m.Id == userId);
            if (member == null) throw new InvalidOperationException("User not found.");

            member.GarminAccessToken = accessToken;
            await _context.SaveChangesAsync();
        }

        protected async Task<string?> GetGarminAccessTokenAsync()
        {
            var userId = GetCurrentUserId();
            if (userId == 0) return null;

            var member = await _context.Get<Member>().FirstOrDefaultAsync(m => m.Id == userId);
            return member?.GarminAccessToken;
        }
    }
}