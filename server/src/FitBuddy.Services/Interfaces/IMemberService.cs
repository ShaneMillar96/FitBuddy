using FitBuddy.Services.Dtos.Members;
using FitBuddy.Services.Dtos.Pagination;

namespace FitBuddy.Services.Interfaces;

public interface IMemberService
{
    Task<PaginatedDto<MemberDto>> RetrieveMembers(PaginationDto pagination);
    Task<MemberDto?> RetrieveMember(int memberId); 
    Task<int> CreateMember(CreateMemberDto member);
    Task<bool> UpdateMember(int memberId, UpdateMemberDto member);
    Task<bool> DeleteMember(int memberId);
    
    Task<DashboardDto> GetMemberDashboardAsync();
}