using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Mvc;
using System.Collections;
using FitBuddy.Api.Validation;
using FluentValidation;

namespace FitBuddy.Api.Controllers.Base;

[ExcludeFromCodeCoverage]
[ApiController]
public class FitBuddyBaseController : ControllerBase
{
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