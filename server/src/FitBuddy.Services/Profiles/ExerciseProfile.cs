using AutoMapper;
using FitBuddy.Dal.Models.application;
using FitBuddy.Services.Dtos.Exercises;

namespace FitBuddy.Services.Profiles;

public class ExerciseProfile : Profile
{
    public ExerciseProfile()
    {
        ConfigureDomainToDto();
        ConfigureDtoToDomain();
    }
    
    private void ConfigureDomainToDto()
    {
        CreateMap<Exercise, ExerciseDto>();
        CreateMap<WorkoutExercise, WorkoutExerciseDto>()
            .ForMember(d => d.Exercise, o => o.MapFrom(x => x.Exercise));
    }

    private void ConfigureDtoToDomain()
    {
        CreateMap<CreateExerciseDto, Exercise>()
            .ForMember(d => d.CreatedDate, 
                o => o.MapFrom(x => DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)));
        
        CreateMap<UpdateExerciseDto, Exercise>();
        
        CreateMap<CreateWorkoutExerciseDto, WorkoutExercise>()
            .ForMember(d => d.CreatedDate,
                o => o.MapFrom(x => DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)));
    }
}