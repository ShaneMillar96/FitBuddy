using FitBuddy.Api.Extensions;
using FitBuddy.Api.Validation;
using FitBuddy.Dal.Enums;
using FluentValidation;

namespace FitBuddy.Api.RequestModels.Workouts;

public class CreateWorkoutRequestModel : IValidatable<CreateWorkoutRequestModelValidator>
{
    private string _name;
    private string _description;

    public string Name 
    { 
        get => _name; 
        set => _name = value?.Trim(); 
    }
    
    public string Description 
    { 
        get => _description; 
        set => _description = value?.Trim(); 
    }
    
    public int TypeId { get; set; }
    
    public CreateWorkoutRequestModelValidator RetrieveValidator() => new ();
}

public class CreateWorkoutRequestModelValidator : AbstractValidator<CreateWorkoutRequestModel>
{
    public CreateWorkoutRequestModelValidator()
    {
        RuleFor(x => x.Name)
            .TrimLength(3, 25)
            .WithMessage("Name should be between at least 3 and 25 characters long.");
        RuleFor(x => x.Description)
            .TrimLength(10)
            .WithMessage("Description should be at least 10 characters long.");
        RuleFor(x => x.TypeId)
            .Must(i => Enum.IsDefined(typeof(WorkoutTypes), i))
            .WithMessage("Workout Type must be a valid type.")
            .NotNull()
            .WithMessage("TypeId should not be null.");
    }
}