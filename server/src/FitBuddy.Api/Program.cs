using FitBuddy.Api.Services;
using FitBuddy.Dal.Contexts;
using FitBuddy.Dal.Database;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Dal.Models.application;
using FitBuddy.Services.Interfaces;
using FitBuddy.Services.Pagination;
using FitBuddy.Services.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(config => config.AllowNullCollections = true, typeof(Program).Assembly,
    typeof(MemberService).Assembly);
builder.Services.AddScoped<IConnectionManager, ConnectionManager>();
builder.Services.AddScoped<IFitBudContext, FitBudContext>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IMemberService, MemberService>();
builder.Services.AddScoped<IWorkoutService, WorkoutService>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<IPaginationService, PaginationService>();

// Configure Identity
builder.Services.AddDbContext<FitBudContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<Member, IdentityRole<int>>()
    .AddEntityFrameworkStores<FitBudContext>()
    .AddDefaultTokenProviders();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAllOrigins");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();