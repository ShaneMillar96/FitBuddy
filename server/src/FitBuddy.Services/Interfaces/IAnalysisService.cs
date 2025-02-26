using FitBuddy.Services.Dtos.Analysis;
using Microsoft.AspNetCore.Http;

namespace FitBuddy.Services.Interfaces;

public interface IAnalysisService
{
    Task<int> UploadAndAnalyzeVideoAsync(int memberId, IFormFile videoFile, int exerciseTypeId);
    Task<ExerciseVideoDto> GetVideoAnalysisAsync(int videoId);
    
    Task<List<ExerciseTypeDto>> RetrieveExerciseTypes();

}