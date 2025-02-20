using AutoMapper;
using FitBuddy.Api.RequestModels.Members;
using FitBuddy.Api.ViewModels.Members;
using FitBuddy.Api.ViewModels.Pagination;
using FitBuddy.Services.Dtos.Members;
using FitBuddy.Services.Dtos.Pagination;

namespace FitBuddy.Api.Profiles;

public class MemberProfile : Profile
{
    public MemberProfile()
    {
        ConfigureDtoToViewModel();
        ConfigureViewModelToDto();
        ConfigurePaginateMapping();
    }
    
    private void ConfigureDtoToViewModel()
    {
        CreateMap<MemberDto, MemberViewModel>();
    }

    private void ConfigureViewModelToDto()
    {
        CreateMap<CreateMemberRequestModel, CreateMemberDto>();
        CreateMap<UpdateMemberRequestModel, UpdateMemberDto>();
    }
    
    private void ConfigurePaginateMapping()
    {
        CreateMap<PaginatedDto<MemberDto>, PaginatedViewModel<MemberViewModel>>();
    }
}