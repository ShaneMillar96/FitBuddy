using AutoMapper;
using FitBuddy.Dal.Models.application;
using FitBuddy.Services.Dtos.Workouts;

namespace FitBuddy.Services.Profiles;

public class WorkoutProfile : Profile
{
    public WorkoutProfile()
    {
        ConfigureDomainToDto();
        ConfigureDtoToDomain();
    }
    
    private void ConfigureDomainToDto()
    {
        CreateMap<Workout, WorkoutDto>()
            .ForMember(d => d.CreatedBy, o => o.MapFrom(x => x.CreatedByNavigation))
            .ForMember(d => d.Type, o => o.MapFrom(x => x.WorkoutType));
        
        CreateMap<WorkoutType, WorkoutTypeDto>();
    }

    private void ConfigureDtoToDomain()
    {
    }
}