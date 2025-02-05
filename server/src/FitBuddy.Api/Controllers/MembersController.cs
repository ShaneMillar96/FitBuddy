using FitBuddy.Api.Controllers.Base;
using Microsoft.AspNetCore.Mvc;

namespace FitBuddy.Api.Controllers;

[ApiController]
[Route("members")]
public class MembersController : FitBuddyBaseController
{
    [HttpGet]
    public ActionResult GetMembers()
    {
        return OkOrNoContent(new { Members = new[] { "Alice", "Bob", "Charlie" } });
    }
    
    [HttpGet("{id}")]
    public ActionResult GetMember(int id)
    {
        return OkOrNoContent(new { Member = "Alice" });
    }
    
    [HttpPost]
    public ActionResult CreateMember([FromBody] string member)
    {
        return Created("Member created", member);
    }
    
    [HttpPut("{id}")]
    public ActionResult UpdateMember(int id, [FromBody] string member)
    {
        return Ok(member);
    }
    
    [HttpDelete("{id}")]
    public ActionResult DeleteMember(int id)
    {
        return NoContent();
    }
}