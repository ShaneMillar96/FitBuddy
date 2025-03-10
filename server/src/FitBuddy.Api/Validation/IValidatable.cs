using FluentValidation;

namespace FitBuddy.Api.Validation;

public interface IValidatable<out T> where T : IValidator
{
    T RetrieveValidator();
}