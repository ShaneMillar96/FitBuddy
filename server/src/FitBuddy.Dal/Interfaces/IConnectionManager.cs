using FitBuddy.Dal.Enums;

namespace FitBuddy.Dal.Interfaces;

public interface IConnectionManager
{
    Task<string?> RetrieveConnection(DatabaseTypes databaseType);
    int GetUser();
}