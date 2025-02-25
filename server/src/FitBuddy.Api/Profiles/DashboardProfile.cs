using AutoMapper;
using FitBuddy.Api.ViewModels.Dashboard;
using FitBuddy.Services.Dtos.Members;

namespace FitBuddy.Api.Profiles;

public class DashboardProfile : Profile
{
    public DashboardProfile()
    {
        ConfigureDtoToViewModel();
        ConfigureViewModelToDto();
        
    }
    
    private void ConfigureDtoToViewModel()
    {
        CreateMap<DashboardDto, DashboardViewModel>();
        CreateMap<BestWorkoutResultDto, BestWorkoutResultViewModel>();
        CreateMap<DailyWorkoutCountDto, DailyWorkoutCountViewModel>();    }
    
    private void ConfigureViewModelToDto()
    {

    }
}