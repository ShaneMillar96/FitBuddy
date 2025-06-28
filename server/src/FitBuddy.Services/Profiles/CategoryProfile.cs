using AutoMapper;
using FitBuddy.Dal.Models.application;
using FitBuddy.Services.Dtos.Categories;
using FitBuddy.Services.Dtos.Exercises;

namespace FitBuddy.Services.Profiles;

public class CategoryProfile : Profile
{
    public CategoryProfile()
    {
        ConfigureDomainToDto();
        ConfigureDtoToDomain();
    }
    
    private void ConfigureDomainToDto()
    {
        // Category mappings
        CreateMap<WorkoutCategory, WorkoutCategoryDto>()
            .ForMember(d => d.SubTypes, o => o.MapFrom(x => x.SubTypes));
        
        CreateMap<WorkoutSubType, WorkoutSubTypeDto>();
        
        // Exercise mappings
        CreateMap<Exercise, ExerciseDto>()
            .ForMember(d => d.CategoryName, o => o.MapFrom(x => x.Category.Name));
            
        CreateMap<WorkoutExercise, WorkoutExerciseDto>()
            .ForMember(d => d.Exercise, o => o.MapFrom(x => x.Exercise));
    }

    private void ConfigureDtoToDomain()
    {
        // Category mappings
        CreateMap<CreateWorkoutCategoryDto, WorkoutCategory>()
            .ForMember(d => d.CreatedDate,
                o => o.MapFrom(x => DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)));

        CreateMap<UpdateWorkoutCategoryDto, WorkoutCategory>();
        
        // Exercise mappings
        CreateMap<CreateExerciseDto, Exercise>()
            .ForMember(d => d.CreatedDate,
                o => o.MapFrom(x => DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)));
                
        CreateMap<UpdateExerciseDto, Exercise>();
        
        CreateMap<CreateWorkoutExerciseDto, WorkoutExercise>();
    }
}