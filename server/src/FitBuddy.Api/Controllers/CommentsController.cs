using FitBuddy.Api.Controllers.Base;
using Microsoft.AspNetCore.Mvc;

namespace FitBuddy.Api.Controllers;

[ApiController]
[Route("comments")]
public class CommentsController : FitBuddyBaseController
{
    [HttpGet]
    public ActionResult GetComments()
    {
        return OkOrNoContent(new { Comments = new[] { "Great job!", "Keep it up!", "You're doing great!" } });
    }
    
    [HttpGet("{id}")]
    public ActionResult GetComment(int id)
    {
        return OkOrNoContent(new { Comment = "Great job!" });
    }
    
    [HttpPost]
    public ActionResult CreateComment([FromBody] string comment)
    {
        return Created("Comment created", comment);
    }
    
    [HttpPut("{id}")]
    public ActionResult UpdateComment(int id, [FromBody] string comment)
    {
        return Ok(comment);
    }
    
    [HttpDelete("{id}")]
    public ActionResult DeleteComment(int id)
    {
        return NoContent();
    }
}