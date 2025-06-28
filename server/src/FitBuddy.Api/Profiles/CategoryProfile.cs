using AutoMapper;
using FitBuddy.Api.RequestModels.Categories;
using FitBuddy.Api.ViewModels.Categories;
using FitBuddy.Api.ViewModels.Exercises;
using FitBuddy.Services.Dtos.Categories;
using FitBuddy.Services.Dtos.Exercises;

namespace FitBuddy.Api.Profiles;

public class CategoryProfile : Profile
{
    public CategoryProfile()
    {
        ConfigureDtoToViewModel();
        ConfigureRequestModelToDto();
    }

    private void ConfigureDtoToViewModel()
    {
        CreateMap<WorkoutCategoryDto, WorkoutCategoryViewModel>()
            .ForMember(d => d.SubTypes, o => o.MapFrom(x => x.SubTypes));
        
        CreateMap<WorkoutSubTypeDto, WorkoutSubTypeViewModel>();
        
        // Exercise mappings
        CreateMap<ExerciseDto, ExerciseViewModel>();
    }

    private void ConfigureRequestModelToDto()
    {
        CreateMap<CreateWorkoutCategoryRequestModel, CreateWorkoutCategoryDto>();
        CreateMap<UpdateWorkoutCategoryRequestModel, UpdateWorkoutCategoryDto>();
    }
}