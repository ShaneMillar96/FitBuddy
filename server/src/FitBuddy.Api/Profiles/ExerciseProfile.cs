using AutoMapper;
using FitBuddy.Api.RequestModels.Exercises;
using FitBuddy.Api.ViewModels.Exercises;
using FitBuddy.Services.Dtos.Exercises;

namespace FitBuddy.Api.Profiles;

public class ExerciseProfile : Profile
{
    public ExerciseProfile()
    {
        ConfigureDtoToViewModel();
        ConfigureRequestModelToDto();
    }
    
    private void ConfigureDtoToViewModel()
    {
        CreateMap<ExerciseDto, ExerciseViewModel>();
        CreateMap<WorkoutExerciseDto, WorkoutExerciseViewModel>();
    }
    
    private void ConfigureRequestModelToDto()
    {
        CreateMap<CreateExerciseRequestModel, CreateExerciseDto>();
        CreateMap<UpdateExerciseRequestModel, UpdateExerciseDto>();
        CreateMap<CreateWorkoutExerciseRequestModel, CreateWorkoutExerciseDto>();
    }
}