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
    }
}
