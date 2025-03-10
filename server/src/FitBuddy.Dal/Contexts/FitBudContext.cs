using FitBuddy.Dal.Enums;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Dal.Models.application;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FitBuddy.Dal.Contexts
{
    public class FitBudContext : BaseContext, IFitBudContext
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public FitBudContext(IConnectionManager connectionManager, IHttpContextAccessor httpContextAccessor)
            : base(connectionManager)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        protected override DatabaseTypes RetrieveDatabaseType() => DatabaseTypes.Application;

        public virtual DbSet<WorkoutResult> WorkoutResults { get; set; }
        public virtual DbSet<Workout> Workouts { get; set; }
        public virtual DbSet<WorkoutType> WorkoutTypes { get; set; }
        public virtual DbSet<Member> Members { get; set; }
        public virtual DbSet<Comment> Comments { get; set; }
        public int GetCurrentUserId()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            if (user == null || !user.Identity.IsAuthenticated) return 0;

            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var userId = GetCurrentUserId();
            if (userId > 0)
            {
                TrackUserDetails(userId);
            }

            return base.SaveChangesAsync(cancellationToken);
        }

        private void TrackUserDetails(int userId)
        {
            var addedEntities = ChangeTracker.Entries<ICreatedByTracking>()
                .Where(x => x.State == EntityState.Added)
                .ToArray();

            foreach (var entity in addedEntities)
            {
                entity.Entity.CreatedById = userId;
            }
        }
    }
}
