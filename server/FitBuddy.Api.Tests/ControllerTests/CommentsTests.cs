using AutoMapper;
using FitBuddy.Api.Controllers;
using FitBuddy.Api.RequestModels.Comments;
using FitBuddy.Api.ViewModels.Comments;
using FitBuddy.Api.ViewModels.Pagination;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Services.Dtos.Comments;
using FitBuddy.Services.Dtos.Pagination;
using FitBuddy.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using Assert = Xunit.Assert;

namespace FitBuddy.Api.Tests.ControllerTests;

public class CommentsTests
{
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<ICommentService> _serviceMock;
    private readonly Mock<IFitBudContext> _contextMock;
    private readonly CommentsController _controller;

    public CommentsTests()
    {
        _mapperMock = new Mock<IMapper>();
        _serviceMock = new Mock<ICommentService>();
        _contextMock = new Mock<IFitBudContext>();
        _controller = new CommentsController(_mapperMock.Object, _serviceMock.Object, _contextMock.Object);    
    }

    [Fact]
    public async Task GetComments_ReturnsOkResult_WithComments()
    {
        // Arrange
        var paginationDto = new PaginationDto();
        var commentsDto = new PaginatedDto<CommentDto> { Data = new List<CommentDto>().ToArray(), TotalCount = 0 };
        var commentsViewModel = new PaginatedViewModel<CommentViewModel> { Data = new List<CommentViewModel>().ToArray(), TotalCount = 0 };

        _serviceMock.Setup(s => s.RetrieveComments(paginationDto, null)).ReturnsAsync(commentsDto);
        _mapperMock.Setup(m => m.Map<PaginatedViewModel<CommentViewModel>>(commentsDto)).Returns(commentsViewModel);

        // Act
        var result = await _controller.GetComments(paginationDto, null);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(commentsViewModel, okResult.Value);
    }

    [Fact]
    public async Task GetComment_ReturnsOkResult_WithComment()
    {
        // Arrange
        var commentId = 1;
        var commentDto = new CommentDto();
        var commentViewModel = new CommentViewModel();

        _serviceMock.Setup(s => s.RetrieveComment(commentId)).ReturnsAsync(commentDto);
        _mapperMock.Setup(m => m.Map<CommentViewModel>(commentDto)).Returns(commentViewModel);

        // Act
        var result = await _controller.GetComment(commentId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(commentViewModel, okResult.Value);
    }

    [Fact]
    public async Task CreateComment_ReturnsCreatedResult_WithCommentId()
    {
        // Arrange
        var createCommentRequest = new CreateCommentRequestModel();
        var createCommentDto = new CreateCommentDto();
        var commentId = 1;

        _mapperMock.Setup(m => m.Map<CreateCommentDto>(createCommentRequest)).Returns(createCommentDto);
        _serviceMock.Setup(s => s.CreateComment(createCommentDto)).ReturnsAsync(commentId);

        // Act
        var result = await _controller.CreateComment(createCommentRequest);

        // Assert
        var createdResult = Assert.IsType<CreatedResult>(result);
        Assert.Equal(commentId, createdResult.Value);
    }

    [Fact]
    public async Task UpdateComment_ReturnsOkResult_WhenCommentIsUpdated()
    {
        // Arrange
        var commentId = 1;
        var updateCommentRequest = new UpdateCommentRequestModel();
        var updateCommentDto = new UpdateCommentDto();

        _mapperMock.Setup(m => m.Map<UpdateCommentDto>(updateCommentRequest)).Returns(updateCommentDto);
        _serviceMock.Setup(s => s.UpdateComment(commentId, updateCommentDto)).ReturnsAsync(true);

        // Act
        var result = await _controller.UpdateComment(commentId, updateCommentRequest);

        // Assert
        Assert.IsType<OkResult>(result);
    }

    [Fact]
    public async Task DeleteComment_ReturnsNoContentResult_WhenCommentIsDeleted()
    {
        // Arrange
        var commentId = 1;

        _serviceMock.Setup(s => s.DeleteComment(commentId)).ReturnsAsync(true);

        // Act
        var result = await _controller.DeleteComment(commentId);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }
}