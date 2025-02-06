using AutoMapper;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Dal.Models.application;
using FitBuddy.Dal.Specifications.Members;
using FitBuddy.Services.Dtos.Members;
using FitBuddy.Services.Dtos.Pagination;
using FitBuddy.Services.Interfaces;
using FitBuddy.Dal.Extensions;
using Microsoft.EntityFrameworkCore;


using Unosquare.EntityFramework.Specification.Common.Extensions;

namespace FitBuddy.Services.Services;

public class MemberService : IMemberService
{
    private readonly IFitBudContext _context;
    private readonly IPaginationService _paginationService;
    private readonly IMapper _mapper;
    
    public MemberService(IFitBudContext context, IPaginationService paginationService, IMapper mapper)
    {
        (_context, _paginationService, _mapper) = (context, paginationService,  mapper);
    }
    
    public async Task<PaginatedDto<MemberDto>> RetrieveMembers(PaginationDto pagination)
    {
        var (pageSize, pageNumber, searchQuery, sortBy, ascending) = pagination;
        
        var query = _context
            .Get<Member>()
            .Where(new MemberBySearchSpec(searchQuery));

        var members = _mapper
            .ProjectTo<MemberDto>(query)
            .OrderBy(sortBy, ascending);

        return await _paginationService.CreatePaginatedResponseAsync(members, pageSize, pageNumber);
    }
    
    public async Task<MemberDto?> RetrieveMember(int id) =>
        await _mapper.ProjectTo<MemberDto>(_context
                .Get<Member>()
                .Where(new MemberByIdSpec(id)))
            .SingleOrDefaultAsync();
  
    
    public async Task<int> CreateMember(CreateMemberDto member)
    {
        var newMember = _mapper.Map<Member>(member); 
        await _context.AddAsync(newMember);
        await _context.SaveChangesAsync();

        return newMember.Id;
    }

    public async Task<string> DeleteMember(int id)
    {
        // Implementation here
        return await Task.FromResult("Member deleted");
    }



    public async Task<string> UpdateMember(int id, string member)
    {
        // Implementation here
        return await Task.FromResult("Member updated");
    }
}