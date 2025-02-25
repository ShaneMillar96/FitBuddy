using FitBuddy.Services.Dtos.Members;

namespace FitBuddy.Services.Interfaces;

public interface IDashboardService
{
    Task<DashboardDto> GetMemberDashboardAsync(int memeberIdc);
}