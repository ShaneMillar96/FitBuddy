using System.Diagnostics.CodeAnalysis;
using FitBuddy.Dal.Extensions;

namespace FitBuddy.Dal;

[ExcludeFromCodeCoverage]
public static class EnvironmentVariables
{
    private const string DbConnectionStringKey = "DB_CONNECTIONSTRING";

#if SamBuild

#else
    public static string DbConnectionString => DbConnectionStringKey.GetValue(
        "Server=localhost;Port=5432;Database=coreiq-saas-dev;User Id=fitbuddy-dev;Password=password1;SearchPath=master;");
#endif
}