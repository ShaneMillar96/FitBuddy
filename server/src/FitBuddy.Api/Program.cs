using FitBuddy.Dal.Contexts;
using FitBuddy.Dal.Database;
using FitBuddy.Dal.Interfaces;
using FitBuddy.Services.Interfaces;
using FitBuddy.Services.Pagination;
using FitBuddy.Services.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAutoMapper(config => config.AllowNullCollections = true, typeof(Program).Assembly,
    typeof(MemberService).Assembly);
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IConnectionManager, ConnectionManager>();
builder.Services.AddScoped<IFitBudContext, FitBudContext>();
builder.Services.AddScoped<IMemberService, MemberService>();
builder.Services.AddScoped<IPaginationService, PaginationService>();



var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(
    o => o
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowAnyOrigin()
);

app.MapControllers();
app.Run();