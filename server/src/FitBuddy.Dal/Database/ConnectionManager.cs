using System.Diagnostics.CodeAnalysis;
using FitBuddy.Dal.Enums;
using FitBuddy.Dal.Interfaces;

namespace FitBuddy.Dal.Database;

[ExcludeFromCodeCoverage]
public class ConnectionManager : IConnectionManager
{
    private string _affiliateId = string.Empty;
    private int _userId = 0;

    public Task<string?> RetrieveConnection(DatabaseTypes databaseType) => 
        databaseType switch
        {
            DatabaseTypes.Application => BuildConnectionForApplication("master"),
      
            _ => throw new ArgumentOutOfRangeException(nameof(databaseType), databaseType, null)
        };
    
    public void SetUserDetails((string, int) userDetails)
    {
        var (affiliateName, userId) = userDetails;
        _affiliateId = affiliateName;
        _userId = userId;
    }
    
    public string GetAffiliate() => _affiliateId;
    public string SetAffiliate(string affilateId) => _affiliateId = affilateId;

    public int GetUser() => _userId;
    
    private async Task<string?> BuildConnectionForApplication(string schema)
    {
        return await Task.FromResult(EnvironmentVariables.DbConnectionString);
    }
}