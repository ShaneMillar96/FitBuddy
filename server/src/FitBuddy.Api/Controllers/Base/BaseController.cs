using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Mvc;
using System.Collections;
using System.Security.Claims;
using FitBuddy.Api.Validation;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Dal.Models.application;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace FitBuddy.Api.Controllers.Base;

[ExcludeFromCodeCoverage]
[ApiController]
public class FitBuddyBaseController : ControllerBase
{
    private readonly IFitBudContext _context;
    
    protected FitBuddyBaseController(IFitBudContext context)
    {
        _context = context;
    }
    
    protected int GetCurrentUserId()
    {
        var user = HttpContext.User;
        if (user == null || !user.Identity?.IsAuthenticated == true)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId) || userId <= 0)
        {
            throw new UnauthorizedAccessException("Invalid or missing user ID claim.");
        }

        return userId;
    }


    protected ActionResult OkOrNoContent(object value)
    {
        if (HasNoValueOrItems(value)) return NoContent();

        return Ok(value);
    }

    protected ActionResult OkOrNoListContent(IList value)
    {
        if (HasNoValueOrItems(value)) return NoContent();

        return Ok(value);
    }

    protected ActionResult OkOrNoNotFound(object value)
    {
        if (HasNoValueOrItems(value)) return NotFound();

        return Ok(value);
    }

    private static bool HasNoValueOrItems(object value)
    {
        return value == null || value is IList { Count: < 1 };
    }
    
    protected static async Task<ActionResult?> Validate<T>(T model) where T : IValidatable<IValidator<T>>, new()
    {
        var validator = model.RetrieveValidator();
        var result = await validator.ValidateAsync(model);
        if (!result.IsValid)
        {
            var validationErrors = result.Errors.Select(x => new
            {
                Field = x.PropertyName,
                Message = x.ErrorMessage
            });

            return new BadRequestObjectResult(new { Errors = validationErrors });
        }

        return null;
    }
}