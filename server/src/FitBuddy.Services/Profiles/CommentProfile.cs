using AutoMapper;
using FitBuddy.Dal.Models.application;
using FitBuddy.Services.Dtos.Comments;

namespace FitBuddy.Services.Profiles;

public class CommentProfile : Profile
{
    public CommentProfile()
    {
        ConfigureDomainToDto();
        ConfigureDtoToDomain();
    }
    
    private void ConfigureDomainToDto()
    {
        CreateMap<Comment, CommentDto>();
    }
    
    private void ConfigureDtoToDomain()
    {
        CreateMap<CreateCommentDto, Comment>()
            .ForMember(d => d.MemberId, o => o.MapFrom(x => 1)) //ToDo - get member id from token
            .ForMember(d => d.Description, o => o.MapFrom(x => x.Comment))
            .ForMember(d => d.CreatedDate,
                o => o.MapFrom(x => DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)));
        CreateMap<UpdateCommentDto, Comment>()
            .ForMember(d => d.Description, o => o.MapFrom(x => x.Comment))
            .ForMember(d => d.ModifiedDate,
                o => o.MapFrom(x => DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)));;
    }
}