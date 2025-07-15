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
            .ForMember(d => d.CreatedBy, o => o.MapFrom(x => x.CreatedBy))
            .ForMember(d => d.ScoreType, o => o.MapFrom(x => x.ScoreType))
            .ForMember(d => d.ResultsLogged, o => o.MapFrom(x => x.WorkoutResults.Count))
            .ForMember(d => d.CommentsCount, o => o.MapFrom(x => x.Comments.Count))
            .ForMember(d => d.WorkoutType, o => o.MapFrom(x => x.WorkoutType))
            .ForMember(d => d.WorkoutExercises, o => o.MapFrom(x => x.WorkoutExercises));
        
        CreateMap<WorkoutType, WorkoutTypeDto>();
        
        CreateMap<WorkoutResult, WorkoutResultDto>()
            .ForMember(d => d.Type, o => o.MapFrom(x => x.Workout.WorkoutType))
            .ForMember(d => d.Member, o => o.MapFrom(x => x.CreatedBy));

        CreateMap<ScoreType, ScoreTypeDto>();
        
        CreateMap<WorkoutFavorite, WorkoutFavoriteDto>()
            .ForMember(d => d.Workout, o => o.MapFrom(x => x.Workout))
            .ForMember(d => d.Member, o => o.MapFrom(x => x.Member));
    }

    private void ConfigureDtoToDomain()
    {
        CreateMap<CreateWorkoutDto, Workout>()
            .ForMember(d => d.WorkoutTypeId, o => o.MapFrom(x => x.TypeId))
            .ForMember(d => d.CreatedDate,
                o => o.MapFrom(x => DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)));

        CreateMap<UpdateWorkoutDto, Workout>()
            .ForMember(d => d.ModifiedDate,
                o => o.MapFrom(x => DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)))
            .ForMember(d => d.WorkoutTypeId, o => o.MapFrom(x => x.TypeId));
        
        CreateMap<CreateWorkoutResultDto, WorkoutResult>()
            .ForMember(d => d.CreatedDate,
            o => o.MapFrom(x => DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)));
        
        CreateMap<UpdateWorkoutResultDto, WorkoutResult>()
            .ForMember(d => d.ModifiedDate,
                o => o.MapFrom(x => DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)));

    }
}