using AutoMapper;
using FitBuddy.Dal.Models.application;
using FitBuddy.Services.Dtos.Analysis;

namespace FitBuddy.Services.Profiles;

public class AnalysisProfile : Profile
{
    public AnalysisProfile()
    {
        ConfigureDomainToDto();
        ConfigureDtoToDomain();
    }
    
    private void ConfigureDomainToDto()
    {
        CreateMap<ExerciseVideo, ExerciseVideoDto>();
    }
    
    private void ConfigureDtoToDomain()
    {
        CreateMap<CreateExerciseVideoDto, ExerciseVideo>()
            .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)));
    }
}