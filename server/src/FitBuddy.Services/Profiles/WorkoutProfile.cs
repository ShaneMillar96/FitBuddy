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
        
        CreateMap<WorkoutResult, WorkoutResultDto>()
            .ForMember(d => d.Member, o => o.MapFrom(x => x.Member));

    }

    private void ConfigureDtoToDomain()
    {
        CreateMap<CreateWorkoutDto, Workout>()
            .ForMember(d => d.WorkoutTypeId, o => o.MapFrom(x => x.TypeId))
            .ForMember(d => d.CreatedBy, o => o.MapFrom(x => 1))
            .ForMember(d => d.CreatedDate,
                o => o.MapFrom(x => DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)));

        CreateMap<UpdateWorkoutDto, Workout>()
            .ForMember(d => d.ModifiedDate,
                o => o.MapFrom(x => DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)))
            .ForMember(d => d.WorkoutTypeId, o => o.MapFrom(x => x.TypeId));
        
        CreateMap<CreateWorkoutResultDto, WorkoutResult>()
            .ForMember(d => d.MemberId, o => o.MapFrom(x => 1)) //ToDo - get member id from token
            .ForMember(d => d.CreatedDate,
            o => o.MapFrom(x => DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)));
        
        CreateMap<UpdateWorkoutResultDto, WorkoutResult>()
            .ForMember(d => d.ModifiedDate,
                o => o.MapFrom(x => DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)));

    }
}