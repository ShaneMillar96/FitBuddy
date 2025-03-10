using AutoMapper;
using FitBuddy.Api.ViewModels.Analysis;
using FitBuddy.Services.Dtos.Analysis;

namespace FitBuddy.Api.Profiles;

public class AnalysisProfile : Profile
{
    public AnalysisProfile()
    {
        ConfigureDtoToViewModel();
        ConfigureViewModelToDto();
    }
    
    private void ConfigureDtoToViewModel()
    {
        CreateMap<ExerciseVideoDto, ExerciseVideoViewModel>();
        CreateMap<ExerciseTypeDto, ExerciseTypeViewModel>();

    }
    
    private void ConfigureViewModelToDto()
    {
    }
    
 
}