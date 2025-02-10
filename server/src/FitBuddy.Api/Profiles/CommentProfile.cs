using AutoMapper;
using FitBuddy.Api.RequestModels.Comments;
using FitBuddy.Api.ViewModels.Comments;
using FitBuddy.Api.ViewModels.Pagination;
using FitBuddy.Services.Dtos.Comments;
using FitBuddy.Services.Dtos.Pagination;

namespace FitBuddy.Api.Profiles;

public class CommentProfile : Profile
{
    public CommentProfile()
    {
        ConfigureDtoToViewModel();
        ConfigureViewModelToDto();
        ConfigurePaginateMapping();
    }
    
    private void ConfigureDtoToViewModel()
    {
        CreateMap<CommentDto, CommentViewModel>();
    }
    
    private void ConfigureViewModelToDto()
    {
        CreateMap<CreateCommentRequestModel, CreateCommentDto>();
    }
    
    private void ConfigurePaginateMapping()
    {
        CreateMap<PaginatedDto<CommentDto>, PaginatedViewModel<CommentViewModel>>();
    }
}