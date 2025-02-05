using FitBuddy.Dal.Enums;
using FitBuddy.Dal.Interfaces;

namespace FitBuddy.Dal.Contexts;

public class FitBudContext : BaseContext, IFitBudContext
{
    public FitBudContext(IConnectionManager connectionManager) : base(connectionManager) { }
    
    protected override DatabaseTypes RetrieveDatabaseType() => DatabaseTypes.Application;


}