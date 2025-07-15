using FitBuddy.Api.Extensions;
using FitBuddy.Api.Validation;
using FitBuddy.Api.RequestModels.Exercises;
using FitBuddy.Dal.Enums;
using FluentValidation;
using System.Text.Json;
using System.ComponentModel.DataAnnotations;

namespace FitBuddy.Api.RequestModels.Workouts;

public class CreateWorkoutRequestModel : IValidatable<CreateWorkoutRequestModelValidator>
{
    private string _name;

    public string Name 
    { 
        get => _name; 
        set => _name = value?.Trim(); 
    }
    
    public int TypeId { get; set; }
    
    // CrossFit-specific fields
    public int? ScoreTypeId { get; set; }
    
    [Range(1, 5)]
    public int? DifficultyLevel { get; set; }
    
    [Range(1, 600)]
    public int? EstimatedDurationMinutes { get; set; }
    
    public List<CreateWorkoutExerciseRequestModel> Exercises { get; set; } = new();
    
    public string? WorkoutTypeData { get; set; }
    
    public CreateWorkoutRequestModelValidator RetrieveValidator() => new ();
}

public class CreateWorkoutRequestModelValidator : AbstractValidator<CreateWorkoutRequestModel>
{
    public CreateWorkoutRequestModelValidator()
    {
        RuleFor(x => x.Name)
            .TrimLength(3, 25)
            .WithMessage("Name should be between at least 3 and 25 characters long.");
        RuleFor(x => x.TypeId)
            .Must(i => Enum.IsDefined(typeof(WorkoutTypes), i))
            .WithMessage("Workout Type must be a valid type.")
            .NotNull()
            .WithMessage("TypeId should not be null.");
    }
}