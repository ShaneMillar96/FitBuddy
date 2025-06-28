using FitBuddy.Services.Dtos.Results;
using FitBuddy.Services.Dtos.Pagination;

namespace FitBuddy.Services.Interfaces;

public interface IEnhancedWorkoutResultService
{
    Task<PaginatedDto<EnhancedWorkoutResultDto>> GetWorkoutResultsAsync(PaginationDto pagination, int? workoutId = null, int? categoryId = null);
    Task<EnhancedWorkoutResultDto?> GetWorkoutResultByIdAsync(int id);
    Task<int> CreateWorkoutResultAsync(CreateEnhancedWorkoutResultDto dto);
    Task<bool> UpdateWorkoutResultAsync(int id, CreateEnhancedWorkoutResultDto dto);
    Task<bool> DeleteWorkoutResultAsync(int id);
    Task<List<EnhancedWorkoutResultDto>> GetPersonalRecordsAsync(int memberId, int? categoryId = null);
    Task<List<EnhancedWorkoutResultDto>> GetRecentResultsAsync(int memberId, int count = 10);
    Task<bool> CheckAndSetPersonalRecord(int workoutResultId);
    Task<Dictionary<string, object>> GetResultAnalyticsAsync(int memberId, int? categoryId = null, DateTime? fromDate = null);
}