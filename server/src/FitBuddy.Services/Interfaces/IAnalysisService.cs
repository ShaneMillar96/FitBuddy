using FitBuddy.Services.Dtos.Analysis;
using Microsoft.AspNetCore.Http;

namespace FitBuddy.Services.Interfaces;

public interface IAnalysisService
{
    Task<int> UploadAndAnalyzeVideoAsync(int memberId, IFormFile videoFile, string exerciseType);
    Task<ExerciseVideoDto> GetVideoAnalysisAsync(int videoId);
}