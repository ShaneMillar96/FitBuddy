using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FitBuddy.Dal.Models.application;
using FitBuddy.Services.Interfaces;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Services.Dtos.Members;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace FitBuddy.Services.Services
{
    public class AccountService : IAccountService
    {
        private readonly IFitBudContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;


        public AccountService(IFitBudContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _configuration = configuration;
        }

        public async Task<Member> RegisterAsync(RegisterMemberDto registerMember)
        {
            if (await _context.Get<Member>()
                    .AnyAsync(m => m.Email.ToLower() == registerMember.Email.ToLower()
                                   || m.Username.ToLower() == registerMember.Username.ToLower()))
            {
                throw new InvalidOperationException("Username or Email already exists.");
            }


            var passwordHash = HashPassword(registerMember.Password);

            var member = _mapper.Map<Member>(registerMember);
            member.PasswordHash = passwordHash;

            await _context.AddAsync(member);
            await _context.SaveChangesAsync();

            return member;
        }

        public async Task<string?> LoginAsync(LoginMemberDto loginMember)
        {
            var member = await _context.Get<Member>().FirstOrDefaultAsync(m => m.Username == loginMember.Username);
            if (member == null || !VerifyPassword(loginMember.Password, member.PasswordHash))
                return null;

            return GenerateJwtToken(member);
        }

        private string GenerateJwtToken(Member member)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, member.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, member.Username),
                new Claim(JwtRegisteredClaimNames.Email, member.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
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
    }
}
