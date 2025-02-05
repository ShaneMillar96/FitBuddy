using System.Diagnostics.CodeAnalysis;
using FitBuddy.Dal.Enums;
using FitBuddy.Dal.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FitBuddy.Dal.Contexts;

[ExcludeFromCodeCoverage]
public abstract class BaseContext : DbContext
{
    private readonly IConnectionManager _connectionManager;
    
    protected BaseContext(IConnectionManager connectionManager) => _connectionManager = connectionManager;

    
    protected abstract DatabaseTypes RetrieveDatabaseType();

    public IQueryable<T> Get<T>() where T : class
    {
        return Set<T>().AsQueryable();
    }

    public new T Add<T>(T item) where T : class
    {
        return Set<T>().Add(item).Entity;
    }

    public void Add<T>(params T[] items) where T : class
    {
        Set<T>().AddRange(items);
    }

    public void AddAsync<T>(params T[] items) where T : class
    {
        Set<T>().AddRangeAsync(items);
    }

    public void Delete<T>(params T[] items) where T : class
    {
        Set<T>().RemoveRange(items);
    }

    public bool ExecuteWithinTransaction(Action action)
    {
        using var transaction = Database.BeginTransaction();
        try
        {
            action();
            transaction.Commit();
            return true;
        }
        catch (Exception)
        {
            transaction.Rollback();
            throw;
        }
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        var connectionString = _connectionManager.RetrieveConnection(RetrieveDatabaseType()).Result;
        if (!string.IsNullOrWhiteSpace(connectionString) && !optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseNpgsql(connectionString);
        }
    }
}