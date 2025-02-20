using FitBuddy.Dal.Models.application;
using System.Threading.Tasks;
using FitBuddy.Services.Dtos.Members;

namespace FitBuddy.Services.Interfaces
{
    public interface IAccountService
    {
        Task<Member> RegisterAsync(RegisterMemberDto member);
        Task<string?> LoginAsync(LoginMemberDto member);
    }
}