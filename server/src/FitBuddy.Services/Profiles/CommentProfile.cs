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
        CreateMap<Comment, CommentDto>()
            .ForMember(d => d.Member, o => o.MapFrom(x => x.CreatedBy));
    }
    
    private void ConfigureDtoToDomain()
    {
        CreateMap<CreateCommentDto, Comment>()
            .ForMember(d => d.Description, o => o.MapFrom(x => x.Comment))
            .ForMember(d => d.CreatedDate,
                o => o.MapFrom(x => DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)));
        CreateMap<UpdateCommentDto, Comment>()
            .ForMember(d => d.Description, o => o.MapFrom(x => x.Comment))
            .ForMember(d => d.ModifiedDate,
                o => o.MapFrom(x => DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)));
    }
}