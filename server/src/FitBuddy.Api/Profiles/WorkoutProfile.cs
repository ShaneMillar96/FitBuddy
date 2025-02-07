using AutoMapper;
using FitBuddy.Api.RequestModels.Workouts;
using FitBuddy.Api.ViewModels.Pagination;
using FitBuddy.Api.ViewModels.Workouts;
using FitBuddy.Services.Dtos.Pagination;
using FitBuddy.Services.Dtos.Workouts;

namespace FitBuddy.Api.Profiles;

public class WorkoutProfile : Profile
{
    public WorkoutProfile()
    {
        ConfigureDtoToViewModel();
        ConfigureViewModelToDto();
        ConfigurePaginateMapping();
    }
    
    private void ConfigureDtoToViewModel()
    {
        CreateMap<WorkoutDto, WorkoutViewModel>();
        CreateMap<WorkoutTypeDto, WorkoutTypeViewModel>();
        CreateMap<WorkoutResultDto, WorkoutResultViewModel>();
    }
    
    private void ConfigureViewModelToDto()
    {
         CreateMap<CreateWorkoutRequestModel, CreateWorkoutDto>();
         CreateMap<UpdateWorkoutRequestModel, UpdateWorkoutDto>();
         CreateMap<CreateWorkoutResultRequestModel, CreateWorkoutResultDto>();
    }
    
    private void ConfigurePaginateMapping()
    {
         CreateMap<PaginatedDto<WorkoutDto>, PaginatedViewModel<WorkoutViewModel>>();
         CreateMap<PaginatedDto<WorkoutResultDto>, PaginatedViewModel<WorkoutResultViewModel>>();
    }
}