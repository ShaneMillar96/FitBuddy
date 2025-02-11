using AutoMapper;
using FitBuddy.Api.Controllers;
using FitBuddy.Api.RequestModels.Members;
using FitBuddy.Api.ViewModels.Members;
using FitBuddy.Services.Dtos.Members;
using FitBuddy.Services.Dtos.Pagination;
using FitBuddy.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using FitBuddy.Api.ViewModels.Pagination;
using Xunit;
using Assert = Xunit.Assert;

namespace FitBuddy.Api.Tests.ControllerTests
{
    public class MembersTests
    {
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IMemberService> _serviceMock;
        private readonly MembersController _controller;

        public MembersTests()
        {
            _mapperMock = new Mock<IMapper>();
            _serviceMock = new Mock<IMemberService>();
            _controller = new MembersController(_mapperMock.Object, _serviceMock.Object);
        }

        [Fact]
        public async Task GetMembers_ReturnsOkResult_WithMembers()
        {
            // Arrange
            var paginationDto = new PaginationDto();
            var membersDto = new PaginatedDto<MemberDto> { Data = new List<MemberDto>().ToArray(), TotalCount = 0 };
            var membersViewModel = new PaginatedViewModel<MemberViewModel> { Data = new List<MemberViewModel>().ToArray(), TotalCount = 0 };

            _serviceMock.Setup(s => s.RetrieveMembers(paginationDto)).ReturnsAsync(membersDto);
            _mapperMock.Setup(m => m.Map<PaginatedViewModel<MemberViewModel>>(membersDto)).Returns(membersViewModel);

            // Act
            var result = await _controller.GetMembers(paginationDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(membersViewModel, okResult.Value);
        }

        [Fact]
        public async Task GetMember_ReturnsOkResult_WithMember()
        {
            // Arrange
            var memberId = 1;
            var memberDto = new MemberDto();
            var memberViewModel = new MemberViewModel();

            _serviceMock.Setup(s => s.RetrieveMember(memberId)).ReturnsAsync(memberDto);
            _mapperMock.Setup(m => m.Map<MemberViewModel>(memberDto)).Returns(memberViewModel);

            // Act
            var result = await _controller.GetMember(memberId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(memberViewModel, okResult.Value);
        }

        [Fact]
        public async Task CreateMember_ReturnsCreatedResult_WithMemberId()
        {
            // Arrange
            var createMemberRequest = new CreateMemberRequestModel();
            var createMemberDto = new CreateMemberDto();
            var memberId = 1;

            _mapperMock.Setup(m => m.Map<CreateMemberDto>(createMemberRequest)).Returns(createMemberDto);
            _serviceMock.Setup(s => s.CreateMember(createMemberDto)).ReturnsAsync(memberId);

            // Act
            var result = await _controller.CreateMember(createMemberRequest);

            // Assert
            var createdResult = Assert.IsType<CreatedResult>(result);
            Assert.Equal(memberId, createdResult.Value);
        }

        [Fact]
        public async Task UpdateMember_ReturnsOkResult_WhenMemberIsUpdated()
        {
            // Arrange
            var memberId = 1;
            var updateMemberRequest = new UpdateMemberRequestModel();
            var updateMemberDto = new UpdateMemberDto();

            _mapperMock.Setup(m => m.Map<UpdateMemberDto>(updateMemberRequest)).Returns(updateMemberDto);
            _serviceMock.Setup(s => s.UpdateMember(memberId, updateMemberDto)).ReturnsAsync(true);

            // Act
            var result = await _controller.UpdateMember(memberId, updateMemberRequest);

            // Assert
            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task DeleteMember_ReturnsNoContentResult_WhenMemberIsDeleted()
        {
            // Arrange
            var memberId = 1;

            _serviceMock.Setup(s => s.DeleteMember(memberId)).ReturnsAsync(true);

            // Act
            var result = await _controller.DeleteMember(memberId);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }
    }
}