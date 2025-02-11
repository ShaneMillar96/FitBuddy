using AutoMapper;
using FitBuddy.Api.Controllers;
using FitBuddy.Api.RequestModels.Workouts;
using FitBuddy.Api.ViewModels.Pagination;
using FitBuddy.Api.ViewModels.Workouts;
using FitBuddy.Dal.Enums;
using FitBuddy.Services.Dtos.Pagination;
using FitBuddy.Services.Dtos.Workouts;
using FitBuddy.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using Assert = Xunit.Assert;

namespace FitBuddy.Api.Tests.ControllerTests;

public class WorkoutsTests
{
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<IWorkoutService> _serviceMock;
    private readonly WorkoutsController _controller;

    public WorkoutsTests()
    {
        _mapperMock = new Mock<IMapper>();
        _serviceMock = new Mock<IWorkoutService>();
        _controller = new WorkoutsController(_mapperMock.Object, _serviceMock.Object);
    }

    [Fact]
    public async Task GetWorkouts_ReturnsOkResult_WithWorkouts()
    {
        // Arrange
        var paginationDto = new PaginationDto();
        var workoutsDto = new PaginatedDto<WorkoutDto> { Data = new List<WorkoutDto>().ToArray(), TotalCount = 0 };
        var workoutsViewModel = new PaginatedViewModel<WorkoutViewModel> { Data = new List<WorkoutViewModel>().ToArray(), TotalCount = 0 };

        _serviceMock.Setup(s => s.RetrieveWorkouts(paginationDto)).ReturnsAsync(workoutsDto);
        _mapperMock.Setup(m => m.Map<PaginatedViewModel<WorkoutViewModel>>(workoutsDto)).Returns(workoutsViewModel);

        // Act
        var result = await _controller.GetWorkouts(paginationDto);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(workoutsViewModel, okResult.Value);
    }

    [Fact]
    public async Task GetWorkout_ReturnsOkResult_WithWorkout()
    {
        // Arrange
        var workoutId = 1;
        var workoutDto = new WorkoutDto();
        var workoutViewModel = new WorkoutViewModel();

        _serviceMock.Setup(s => s.RetrieveWorkout(workoutId)).ReturnsAsync(workoutDto);
        _mapperMock.Setup(m => m.Map<WorkoutViewModel>(workoutDto)).Returns(workoutViewModel);

        // Act
        var result = await _controller.GetWorkout(workoutId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(workoutViewModel, okResult.Value);
    }

    [Fact]
    public async Task CreateWorkout_ReturnsCreatedResult_WithWorkoutId()
    {
        // Arrange
        var createWorkoutRequest = new CreateWorkoutRequestModel
        {
            Name = "Test Workout",
            Description = "Test Description",
            TypeId = (int)WorkoutTypes.EMOM,
        };
        
        var createWorkoutDto = new CreateWorkoutDto();
        var workoutId = 1;

        _mapperMock.Setup(m => m.Map<CreateWorkoutDto>(createWorkoutRequest)).Returns(createWorkoutDto);
        _serviceMock.Setup(s => s.CreateWorkout(createWorkoutDto)).ReturnsAsync(workoutId);
        
        // Act
        var result = await _controller.CreateWorkout(createWorkoutRequest);

        // Assert
        var createdResult = Assert.IsType<CreatedResult>(result);
        Assert.Equal(workoutId, createdResult.Value);
    }

    [Fact]
    public async Task UpdateWorkout_ReturnsOkResult_WhenWorkoutIsUpdated()
    {
        // Arrange
        var workoutId = 1;
        var updateWorkoutRequest = new UpdateWorkoutRequestModel
        {
            Name = "Test Workout Update",
            Description = "Test Description Update",
            TypeId = (int)WorkoutTypes.EMOM,
        };
        var updateWorkoutDto = new UpdateWorkoutDto();

        _mapperMock.Setup(m => m.Map<UpdateWorkoutDto>(updateWorkoutRequest)).Returns(updateWorkoutDto);
        _serviceMock.Setup(s => s.UpdateWorkout(workoutId, updateWorkoutDto)).ReturnsAsync(true);

        // Act
        var result = await _controller.UpdateWorkout(workoutId, updateWorkoutRequest);

        // Assert
        Assert.IsType<OkResult>(result);
    }

    [Fact]
    public async Task DeleteWorkout_ReturnsNoContentResult_WhenWorkoutIsDeleted()
    {
        // Arrange
        var workoutId = 1;

        _serviceMock.Setup(s => s.DeleteWorkout(workoutId)).ReturnsAsync(true);

        // Act
        var result = await _controller.DeleteWorkout(workoutId);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task GetWorkoutTypes_ReturnsOkResult_WithWorkoutTypes()
    {
        // Arrange
        const int id = 1;
        var workoutTypesDto = new WorkoutTypeDto
        {
            Id = id,
            Name = WorkoutTypes.EMOM.ToString(),
        };
        var workoutTypesList = new List<WorkoutTypeDto> { workoutTypesDto };
        
        var workoutTypesViewModelList = new List<WorkoutTypeViewModel>{ new() };

        _serviceMock.Setup(s => s.RetrieveWorkoutTypes()).ReturnsAsync(workoutTypesList);
        _mapperMock.Setup(m => m.Map<List<WorkoutTypeViewModel>>(workoutTypesList)).Returns(workoutTypesViewModelList);

        // Act
        var result = await _controller.GetWorkoutTypes();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(workoutTypesViewModelList, okResult.Value);
    }

    [Fact]
    public async Task GetWorkoutResults_ReturnsOkResult_WithWorkoutResults()
    {
        // Arrange
        var paginationDto = new PaginationDto();
        var workoutId = 1;
        var workoutResultsDto = new PaginatedDto<WorkoutResultDto> { Data = new List<WorkoutResultDto>().ToArray(), TotalCount = 0 };
        var workoutResultsViewModel = new PaginatedViewModel<WorkoutResultViewModel> { Data = new List<WorkoutResultViewModel>().ToArray(), TotalCount = 0 };

        _serviceMock.Setup(s => s.RetrieveWorkoutResults(paginationDto, workoutId)).ReturnsAsync(workoutResultsDto);
        _mapperMock.Setup(m => m.Map<PaginatedViewModel<WorkoutResultViewModel>>(workoutResultsDto)).Returns(workoutResultsViewModel);

        // Act
        var result = await _controller.GetWorkoutResults(paginationDto, workoutId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(workoutResultsViewModel, okResult.Value);
    }

    [Fact]
    public async Task CreateWorkoutResult_ReturnsCreatedResult_WithResultId()
    {
        // Arrange
        var createWorkoutResultRequest = new CreateWorkoutResultRequestModel { WorkoutId = 1 };
        var createWorkoutResultDto = new CreateWorkoutResultDto();
        var resultId = 1;

        _mapperMock.Setup(m => m.Map<CreateWorkoutResultDto>(createWorkoutResultRequest)).Returns(createWorkoutResultDto);
        _serviceMock.Setup(s => s.ResultExists(createWorkoutResultRequest.WorkoutId, 1)).ReturnsAsync(false);
        _serviceMock.Setup(s => s.CreateWorkoutResult(createWorkoutResultDto)).ReturnsAsync(resultId);

        // Act
        var result = await _controller.CreateWorkoutResult(createWorkoutResultRequest);

        // Assert
        var createdResult = Assert.IsType<CreatedResult>(result);
        Assert.Equal(resultId, createdResult.Value);
    }

    [Fact]
    public async Task UpdateWorkoutResult_ReturnsOkResult_WhenWorkoutResultIsUpdated()
    {
        // Arrange
        var resultId = 1;
        var updateWorkoutResultRequest = new UpdateWorkoutResultRequestModel();
        var updateWorkoutResultDto = new UpdateWorkoutResultDto();

        _mapperMock.Setup(m => m.Map<UpdateWorkoutResultDto>(updateWorkoutResultRequest)).Returns(updateWorkoutResultDto);
        _serviceMock.Setup(s => s.UpdateWorkoutResult(resultId, updateWorkoutResultDto)).ReturnsAsync(true);

        // Act
        var result = await _controller.UpdateWorkoutResult(resultId, updateWorkoutResultRequest);

        // Assert
        Assert.IsType<OkResult>(result);
    }
}