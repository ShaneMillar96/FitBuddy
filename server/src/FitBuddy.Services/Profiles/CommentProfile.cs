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
        CreateMap<CreateCommentDto, Comment>();
        CreateMap<UpdateCommentDto, Comment>();
    }
}