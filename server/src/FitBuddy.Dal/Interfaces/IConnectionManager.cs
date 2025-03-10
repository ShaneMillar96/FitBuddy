using FitBuddy.Dal.Enums;

namespace FitBuddy.Dal.Interfaces;

public interface IConnectionManager
{
    Task<string?> RetrieveConnection(DatabaseTypes databaseType);
    
    void SetUserDetails((string, int) userDetails);
    string GetAffiliate();
    string SetAffiliate(string affiliateId);

    int GetUser();
}