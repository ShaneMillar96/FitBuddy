using System.Diagnostics.CodeAnalysis;
using Amazon.Lambda.Annotations;
using Microsoft.Extensions.DependencyInjection;

namespace FitBuddy.Infrastructure;

[ExcludeFromCodeCoverage]
[LambdaStartup]
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
    }
}
