using AutoMapper;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Dal.Models.application;
using FitBuddy.Services.Dtos.Exercises;
using FitBuddy.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitBuddy.Services.Services;

public class ExerciseService : IExerciseService
{
    private readonly IFitBudContext _context;
    private readonly IMapper _mapper;

    public ExerciseService(IFitBudContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<ExerciseDto>> RetrieveExercises()
    {
        var exercises = await _context.Get<Exercise>()
            .OrderBy(e => e.Name)
            .ToListAsync();

        return _mapper.Map<List<ExerciseDto>>(exercises);
    }

    public async Task<ExerciseDto?> RetrieveExercise(int exerciseId)
    {
        var exercise = await _context.Get<Exercise>()
            .FirstOrDefaultAsync(e => e.Id == exerciseId);

        return exercise != null ? _mapper.Map<ExerciseDto>(exercise) : null;
    }

    public async Task<List<ExerciseDto>> SearchExercises(string searchTerm)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
        {
            return await RetrieveExercises();
        }

        var exercises = await _context.Get<Exercise>()
            .Where(e => e.Name.ToLower().Contains(searchTerm.ToLower()) ||
                       (e.Description != null && e.Description.ToLower().Contains(searchTerm.ToLower())))
            .OrderBy(e => e.Name)
            .ToListAsync();

        return _mapper.Map<List<ExerciseDto>>(exercises);
    }
}