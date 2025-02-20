using FitBuddy.Dal.Contexts;
using FitBuddy.Dal.Models.application;
using FitBuddy.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using FitBuddy.Services.Dtos.Members;

namespace FitBuddy.Services.Services
{
    public class AccountService : IAccountService
    {
        private readonly FitBudContext _context;
        private readonly IMapper _mapper;

        public AccountService(FitBudContext context,  IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Member> RegisterAsync(RegisterMemberDto registerMember)
        {
            if (await _context.Members.AnyAsync(m => m.Email == registerMember.Email || m.Username == registerMember.Username))
                throw new Exception("Username or Email already exists.");

            var passwordHash = HashPassword(registerMember.Password);

            var member = _mapper.Map<Member>(registerMember);
            member.PasswordHash = passwordHash;

            _context.Members.Add(member);
            await _context.SaveChangesAsync();

            return member;
        }

        public async Task<string?> LoginAsync(LoginMemberDto loginMember)
        {
            var member = await _context.Members.FirstOrDefaultAsync(m => m.Username == loginMember.Username);
            if (member == null || !VerifyPassword(loginMember.Password, member.PasswordHash))
                return null;

            return GenerateJwtToken(member);
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            return HashPassword(password) == storedHash;
        }

        private string GenerateJwtToken(Member member)
        {
            // TODO: Implement JWT token generation
            return "jwt_token_placeholder";
        }
    }
}
