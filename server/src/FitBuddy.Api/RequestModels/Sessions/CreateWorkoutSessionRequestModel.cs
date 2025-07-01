using FitBuddy.Api.Validation;
using FluentValidation;

namespace FitBuddy.Api.RequestModels.Sessions;

public class CreateWorkoutSessionRequestModel : IValidatable<CreateWorkoutSessionRequestModelValidator>
{
    public string Id { get; set; } = null!;
    public int WorkoutId { get; set; }
    public List<CreateSessionExerciseProgressRequestModel> ExerciseProgress { get; set; } = new();

    public CreateWorkoutSessionRequestModelValidator RetrieveValidator() => new();
}

public class CreateSessionExerciseProgressRequestModel : IValidatable<CreateSessionExerciseProgressRequestModelValidator>
{
    public int ExerciseId { get; set; }
    public int OrderInWorkout { get; set; }
    public int? PlannedSets { get; set; }
    public int? PlannedReps { get; set; }
    public decimal? PlannedWeightKg { get; set; }
    public int? PlannedDistanceMeters { get; set; }
    public int? PlannedDurationSeconds { get; set; }
    public int? PlannedRestSeconds { get; set; }

    public CreateSessionExerciseProgressRequestModelValidator RetrieveValidator() => new();
}

public class CompleteWorkoutSessionRequestModel : IValidatable<CompleteWorkoutSessionRequestModelValidator>
{
    public int Rating { get; set; } // 1-5 stars
    public string? Mood { get; set; } // terrible, bad, okay, good, amazing
    public string? EnergyLevel { get; set; } // very_low, low, medium, high, very_high
    public string? Notes { get; set; }
    public bool IsPublic { get; set; } = true;

    public CompleteWorkoutSessionRequestModelValidator RetrieveValidator() => new();
}

public class UpdateSessionExerciseProgressRequestModel : IValidatable<UpdateSessionExerciseProgressRequestModelValidator>
{
    public string Status { get; set; } = null!; // NotStarted, InProgress, Completed, Skipped
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public string? Notes { get; set; }

    public UpdateSessionExerciseProgressRequestModelValidator RetrieveValidator() => new();
}

public class UpdateSessionSetProgressRequestModel : IValidatable<UpdateSessionSetProgressRequestModelValidator>
{
    public string Status { get; set; } = null!; // NotStarted, InProgress, Completed, Skipped
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public int? ActualReps { get; set; }
    public decimal? ActualWeightKg { get; set; }
    public int? ActualDistanceMeters { get; set; }
    public int? ActualDurationSeconds { get; set; }
    public DateTime? RestStartTime { get; set; }
    public DateTime? RestEndTime { get; set; }
    public int? ActualRestSeconds { get; set; }
    public string? Notes { get; set; }
    public int? RPE { get; set; } // 1-10

    public UpdateSessionSetProgressRequestModelValidator RetrieveValidator() => new();
}

// Validators
public class CreateWorkoutSessionRequestModelValidator : AbstractValidator<CreateWorkoutSessionRequestModel>
{
    public CreateWorkoutSessionRequestModelValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Session ID is required");

        RuleFor(x => x.WorkoutId)
            .GreaterThan(0)
            .WithMessage("Valid workout ID is required");

        RuleFor(x => x.ExerciseProgress)
            .NotEmpty()
            .WithMessage("At least one exercise is required");
    }
}

public class CreateSessionExerciseProgressRequestModelValidator : AbstractValidator<CreateSessionExerciseProgressRequestModel>
{
    public CreateSessionExerciseProgressRequestModelValidator()
    {
        RuleFor(x => x.ExerciseId)
            .GreaterThan(0)
            .WithMessage("Valid exercise ID is required");

        RuleFor(x => x.OrderInWorkout)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Order in workout cannot be negative");

        RuleFor(x => x.PlannedSets)
            .GreaterThan(0)
            .When(x => x.PlannedSets.HasValue)
            .WithMessage("Planned sets must be greater than 0");

        RuleFor(x => x.PlannedReps)
            .GreaterThan(0)
            .When(x => x.PlannedReps.HasValue)
            .WithMessage("Planned reps must be greater than 0");

        RuleFor(x => x.PlannedWeightKg)
            .GreaterThanOrEqualTo(0)
            .When(x => x.PlannedWeightKg.HasValue)
            .WithMessage("Planned weight cannot be negative");
    }
}

public class CompleteWorkoutSessionRequestModelValidator : AbstractValidator<CompleteWorkoutSessionRequestModel>
{
    public CompleteWorkoutSessionRequestModelValidator()
    {
        RuleFor(x => x.Rating)
            .InclusiveBetween(1, 5)
            .WithMessage("Rating must be between 1 and 5");

        RuleFor(x => x.Mood)
            .Must(mood => string.IsNullOrEmpty(mood) || new[] { "terrible", "bad", "okay", "good", "amazing" }.Contains(mood.ToLower()))
            .WithMessage("Mood must be one of: terrible, bad, okay, good, amazing");

        RuleFor(x => x.EnergyLevel)
            .Must(energy => string.IsNullOrEmpty(energy) || new[] { "very_low", "low", "medium", "high", "very_high" }.Contains(energy.ToLower()))
            .WithMessage("Energy level must be one of: very_low, low, medium, high, very_high");

        RuleFor(x => x.Notes)
            .MaximumLength(1000)
            .WithMessage("Notes cannot exceed 1000 characters");
    }
}

public class UpdateSessionExerciseProgressRequestModelValidator : AbstractValidator<UpdateSessionExerciseProgressRequestModel>
{
    public UpdateSessionExerciseProgressRequestModelValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty()
            .WithMessage("Status is required")
            .Must(status => new[] { "NotStarted", "InProgress", "Completed", "Skipped" }.Contains(status))
            .WithMessage("Status must be one of: NotStarted, InProgress, Completed, Skipped");

        RuleFor(x => x.Notes)
            .MaximumLength(500)
            .WithMessage("Notes cannot exceed 500 characters");
    }
}

public class UpdateSessionSetProgressRequestModelValidator : AbstractValidator<UpdateSessionSetProgressRequestModel>
{
    public UpdateSessionSetProgressRequestModelValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty()
            .WithMessage("Status is required")
            .Must(status => new[] { "NotStarted", "InProgress", "Completed", "Skipped" }.Contains(status))
            .WithMessage("Status must be one of: NotStarted, InProgress, Completed, Skipped");

        RuleFor(x => x.ActualReps)
            .GreaterThanOrEqualTo(0)
            .When(x => x.ActualReps.HasValue)
            .WithMessage("Actual reps cannot be negative");

        RuleFor(x => x.ActualWeightKg)
            .GreaterThanOrEqualTo(0)
            .When(x => x.ActualWeightKg.HasValue)
            .WithMessage("Actual weight cannot be negative");

        RuleFor(x => x.RPE)
            .InclusiveBetween(1, 10)
            .When(x => x.RPE.HasValue)
            .WithMessage("RPE must be between 1 and 10");

        RuleFor(x => x.Notes)
            .MaximumLength(500)
            .WithMessage("Notes cannot exceed 500 characters");
    }
}