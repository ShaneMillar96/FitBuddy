using FitBuddy.Services.Dtos.Members;
using FitBuddy.Services.Dtos.Pagination;

namespace FitBuddy.Services.Interfaces;

public interface IMemberService
{
    Task<PaginatedDto<MemberDto>> RetrieveMembers(PaginationDto pagination);
    Task<MemberDto?> RetrieveMember(int memberId); 
    Task<int> CreateMember(CreateMemberDto member);
    Task<string> UpdateMember(int memberId, string member);
    Task<string> DeleteMember(int memberId);
}