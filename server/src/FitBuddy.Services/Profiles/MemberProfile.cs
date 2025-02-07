using AutoMapper;
using FitBuddy.Dal.Models.application;
using FitBuddy.Services.Dtos.Members;

namespace FitBuddy.Services.Profiles;

public class MemberProfile : Profile
{
    public MemberProfile()
    {
        ConfigureDomainToDto();
        ConfigureDtoToDomain();
    }
    
    private void ConfigureDomainToDto()
    {
        CreateMap<Member, MemberDto>();
    }

    private void ConfigureDtoToDomain()
    {
        CreateMap<CreateMemberDto, Member>()
            .ForMember(d => d.CreatedDate, o => o.MapFrom(x => DateTime.UtcNow));

        CreateMap<UpdateMemberDto, Member>()
            .ForMember(d => d.ModifiedDate,
                o => o.MapFrom(x => DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)))
            .ForMember(d => d.Email, o => o.Condition(src => src.Email != null))
            .ForMember(d => d.Username, o => o.Condition(src => src.Username != null));
    }
}
