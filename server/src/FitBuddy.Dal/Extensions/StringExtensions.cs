namespace FitBuddy.Dal.Extensions;

public static class StringExtensions
{
    public static string GetValue(this string @this, string? defaultValue = null)
    {
        return GetVariable(@this) 
               ?? defaultValue
               ?? throw new ArgumentException($"There is no environment variable with name: {@this}. Please check parameters");
    }
        
    public static T GetValue<T>(this string @this, string? defaultValue = null) where T : IConvertible
    {
        var value = GetValue(@this, defaultValue);
        return (T)Convert.ChangeType(value, typeof(T));
    }

    private static string? GetVariable(this string @this)
    {
        return Environment.GetEnvironmentVariable(@this);
    }
}