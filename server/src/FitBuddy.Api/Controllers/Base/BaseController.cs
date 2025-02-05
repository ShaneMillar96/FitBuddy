using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Mvc;
using System.Collections;

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
}