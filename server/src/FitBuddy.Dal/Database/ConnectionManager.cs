using System.Diagnostics.CodeAnalysis;
using FitBuddy.Dal.Enums;
using FitBuddy.Dal.Interfaces;

namespace FitBuddy.Dal.Database;

[ExcludeFromCodeCoverage]
public class ConnectionManager : IConnectionManager
{
    private int _userId = 0;

    public Task<string?> RetrieveConnection(DatabaseTypes databaseType) => 
        databaseType switch
        {
            DatabaseTypes.Application => BuildConnectionForApplication("master"),
      
            _ => throw new ArgumentOutOfRangeException(nameof(databaseType), databaseType, null)
        };
    
    public int GetUser() => _userId;
    
    private async Task<string?> BuildConnectionForApplication(string schema)
    {
        return await Task.FromResult(EnvironmentVariables.DbConnectionString);
    }
}