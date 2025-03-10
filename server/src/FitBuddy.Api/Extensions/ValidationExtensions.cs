using FluentValidation;

namespace FitBuddy.Api.Extensions;


public static class ValidationExtensions
{
    public static IRuleBuilderOptions<T, string> TrimLength<T>(this IRuleBuilder<T, string> ruleBuilder, int? min = null, int? max = null) =>
        ruleBuilder.Must(x => x != null && (min.HasValue || max.HasValue) && 
                              (!min.HasValue || x.Trim().Length >= min) && 
                              (!max.HasValue || x.Trim().Length <= max));
}