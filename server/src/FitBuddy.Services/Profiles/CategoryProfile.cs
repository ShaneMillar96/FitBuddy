using AutoMapper;
using FitBuddy.Dal.Models.application;
using FitBuddy.Services.Dtos.Categories;

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
        CreateMap<WorkoutCategory, WorkoutCategoryDto>()
            .ForMember(d => d.SubTypes, o => o.MapFrom(x => x.SubTypes));
        
        CreateMap<WorkoutSubType, WorkoutSubTypeDto>();
    }

    private void ConfigureDtoToDomain()
    {
        CreateMap<CreateWorkoutCategoryDto, WorkoutCategory>()
            .ForMember(d => d.CreatedDate,
                o => o.MapFrom(x => DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)));

        CreateMap<UpdateWorkoutCategoryDto, WorkoutCategory>();
    }
}