# Backend Architecture

## 🏗️ .NET Core Backend Structure

The FitBuddy backend is built using .NET Core 8 following Clean Architecture principles with clear separation of concerns.

## 📁 Project Structure

```
server/src/
├── FitBuddy.Api/                 # API Layer (Controllers, Startup)
│   ├── Controllers/              # REST API Controllers
│   ├── Profiles/                 # AutoMapper Profiles
│   ├── Middleware/               # Custom middleware
│   └── Program.cs                # Application entry point
├── FitBuddy.Services/            # Business Logic Layer
│   ├── Services/                 # Business logic implementations
│   ├── Interfaces/               # Service contracts
│   ├── Profiles/                 # AutoMapper Profiles
│   └── DTOs/                     # Data Transfer Objects
├── FitBuddy.Dal/                 # Data Access Layer
│   ├── Models/                   # Entity Framework models
│   ├── Contexts/                 # Database contexts
│   └── Repositories/             # Data access implementations
└── FitBuddy.Infrastructure/      # Infrastructure & DI
    ├── Extensions/               # Service registration
    └── Configuration/            # Configuration settings
```

## 🎯 Architecture Layers

### 1. API Layer (`FitBuddy.Api`)

**Purpose**: HTTP request handling and response formatting

**Key Components**:
- **Controllers**: Handle HTTP requests and responses
- **Middleware**: Cross-cutting concerns (authentication, logging)
- **Profiles**: API-specific AutoMapper configurations
- **Startup**: Dependency injection and service configuration

**Example Controller Structure**:
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WorkoutsController : ControllerBase
{
    private readonly IWorkoutService _workoutService;
    private readonly IMapper _mapper;

    public WorkoutsController(IWorkoutService workoutService, IMapper mapper)
    {
        _workoutService = workoutService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedViewModel<WorkoutViewModel>>> GetWorkouts(
        [FromQuery] PaginationDto pagination)
    {
        var workouts = await _workoutService.RetrieveWorkouts(pagination);
        return Ok(_mapper.Map<PaginatedViewModel<WorkoutViewModel>>(workouts));
    }
}
```

### 2. Services Layer (`FitBuddy.Services`)

**Purpose**: Business logic implementation and domain operations

**Key Components**:
- **Services**: Business logic implementations
- **Interfaces**: Service contracts and abstractions
- **DTOs**: Data transfer objects for inter-layer communication
- **Profiles**: Service-specific AutoMapper configurations

**Service Implementation Pattern**:
```csharp
public interface IWorkoutService
{
    Task<PaginatedDto<WorkoutDto>> RetrieveWorkouts(PaginationDto pagination);
    Task<WorkoutDto> CreateWorkout(CreateWorkoutDto createWorkoutDto);
    Task<WorkoutDto> GetWorkoutById(int id);
}

public class WorkoutService : IWorkoutService
{
    private readonly IWorkoutRepository _workoutRepository;
    private readonly IMapper _mapper;

    public WorkoutService(IWorkoutRepository workoutRepository, IMapper mapper)
    {
        _workoutRepository = workoutRepository;
        _mapper = mapper;
    }

    public async Task<PaginatedDto<WorkoutDto>> RetrieveWorkouts(PaginationDto pagination)
    {
        var workouts = await _workoutRepository.GetWorkoutsAsync(pagination);
        return _mapper.Map<PaginatedDto<WorkoutDto>>(workouts);
    }
}
```

### 3. Data Access Layer (`FitBuddy.Dal`)

**Purpose**: Database operations and data persistence

**Key Components**:
- **Models**: Entity Framework domain models
- **Contexts**: Database contexts and configurations
- **Repositories**: Data access abstractions and implementations

**Entity Model Example**:
```csharp
public class Workout
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int WorkoutTypeId { get; set; }
    public int CreatedById { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }

    // Navigation properties
    public WorkoutType WorkoutType { get; set; } = null!;
    public Member CreatedBy { get; set; } = null!;
    public ICollection<WorkoutExercise> WorkoutExercises { get; set; } = new List<WorkoutExercise>();
    public ICollection<WorkoutResult> WorkoutResults { get; set; } = new List<WorkoutResult>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
```

### 4. Infrastructure Layer (`FitBuddy.Infrastructure`)

**Purpose**: Cross-cutting concerns and external dependencies

**Key Components**:
- **Extensions**: Service registration and configuration
- **Configuration**: Application settings and options

## 🔧 Key Technologies & Patterns

### 1. Dependency Injection

**Service Registration**:
```csharp
// Program.cs
builder.Services.AddScoped<IWorkoutService, WorkoutService>();
builder.Services.AddScoped<IWorkoutRepository, WorkoutRepository>();
builder.Services.AddScoped<IMemberService, MemberService>();
builder.Services.AddScoped<ICommentService, CommentService>();
```

### 2. AutoMapper Configuration

**Profile Examples**:
```csharp
// API Profile
public class WorkoutProfile : Profile
{
    public WorkoutProfile()
    {
        CreateMap<WorkoutDto, WorkoutViewModel>();
        CreateMap<CreateWorkoutRequestModel, CreateWorkoutDto>();
        CreateMap<PaginatedDto<WorkoutDto>, PaginatedViewModel<WorkoutViewModel>>();
    }
}

// Service Profile
public class WorkoutServiceProfile : Profile
{
    public WorkoutServiceProfile()
    {
        CreateMap<Workout, WorkoutDto>();
        CreateMap<CreateWorkoutDto, Workout>()
            .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => DateTime.UtcNow));
    }
}
```

### 3. Entity Framework Configuration

**DbContext Configuration**:
```csharp
public class FitBuddyDbContext : DbContext
{
    public DbSet<Member> Members { get; set; } = null!;
    public DbSet<Workout> Workouts { get; set; } = null!;
    public DbSet<WorkoutType> WorkoutTypes { get; set; } = null!;
    public DbSet<Exercise> Exercises { get; set; } = null!;
    public DbSet<WorkoutExercise> WorkoutExercises { get; set; } = null!;
    public DbSet<WorkoutResult> WorkoutResults { get; set; } = null!;
    public DbSet<Comment> Comments { get; set; } = null!;
    public DbSet<WorkoutFavorite> WorkoutFavorites { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure relationships and constraints
        modelBuilder.Entity<Workout>()
            .HasOne(w => w.CreatedBy)
            .WithMany(m => m.Workouts)
            .HasForeignKey(w => w.CreatedById);

        modelBuilder.Entity<WorkoutExercise>()
            .HasKey(we => we.Id);
    }
}
```

## 🔐 Authentication & Authorization

### JWT Authentication Implementation

**JWT Configuration**:
```csharp
// Program.cs
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });
```

**Authentication Service**:
```csharp
public class AuthenticationService : IAuthenticationService
{
    public async Task<AuthenticationResult> AuthenticateAsync(string email, string password)
    {
        var member = await _memberRepository.GetMemberByEmailAsync(email);
        
        if (member == null || !VerifyPassword(password, member.PasswordHash))
        {
            return new AuthenticationResult { Success = false };
        }

        var token = GenerateJwtToken(member);
        return new AuthenticationResult 
        { 
            Success = true, 
            Token = token,
            Member = _mapper.Map<MemberDto>(member)
        };
    }

    private string GenerateJwtToken(Member member)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, member.Id.ToString()),
            new Claim(ClaimTypes.Name, member.Username),
            new Claim(ClaimTypes.Email, member.Email)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
```

## 📊 Data Transfer Objects (DTOs)

### DTO Design Pattern

**Request Models** (API → Services):
```csharp
public class CreateWorkoutRequestModel
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int WorkoutTypeId { get; set; }
    public int? ScoreTypeId { get; set; }
    public int? DifficultyLevel { get; set; }
    public int? EstimatedDurationMinutes { get; set; }
    public CreateWorkoutExerciseRequestModel[] Exercises { get; set; } = Array.Empty<CreateWorkoutExerciseRequestModel>();
}
```

**Service DTOs** (Services ↔ Dal):
```csharp
public class WorkoutDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int WorkoutTypeId { get; set; }
    public string? WorkoutTypeName { get; set; }
    public int CreatedById { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public List<WorkoutExerciseDto> Exercises { get; set; } = new();
}
```

**View Models** (API → Frontend):
```csharp
public class WorkoutViewModel
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string WorkoutTypeName { get; set; } = string.Empty;
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public int ExerciseCount { get; set; }
    public int? EstimatedDurationMinutes { get; set; }
}
```

## 🔄 API Patterns

### RESTful Endpoint Design

**Standard CRUD Operations**:
```csharp
[HttpGet]                           // GET /api/workouts
[HttpGet("{id}")]                   // GET /api/workouts/{id}
[HttpPost]                          // POST /api/workouts
[HttpPut("{id}")]                   // PUT /api/workouts/{id}
[HttpDelete("{id}")]                // DELETE /api/workouts/{id}
```

**Specialized Endpoints**:
```csharp
[HttpGet("types")]                  // GET /api/workouts/types
[HttpGet("{id}/results")]           // GET /api/workouts/{id}/results
[HttpPost("{id}/favorite")]         // POST /api/workouts/{id}/favorite
[HttpGet("dashboard")]              // GET /api/workouts/dashboard
```

### Error Handling

**Global Exception Handling**:
```csharp
public class GlobalExceptionMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        var response = new ErrorResponse();
        
        switch (ex)
        {
            case NotFoundException:
                response.StatusCode = 404;
                response.Message = ex.Message;
                break;
            case ValidationException:
                response.StatusCode = 400;
                response.Message = ex.Message;
                break;
            default:
                response.StatusCode = 500;
                response.Message = "An error occurred while processing your request.";
                break;
        }

        context.Response.StatusCode = response.StatusCode;
        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
```

## 📈 Performance Considerations

### Database Optimization

**Efficient Queries**:
```csharp
public async Task<PaginatedDto<WorkoutDto>> GetWorkoutsAsync(PaginationDto pagination)
{
    var query = _context.Workouts
        .Include(w => w.WorkoutType)
        .Include(w => w.CreatedBy)
        .Include(w => w.WorkoutExercises)
            .ThenInclude(we => we.Exercise)
        .OrderByDescending(w => w.CreatedDate);

    var totalCount = await query.CountAsync();
    var workouts = await query
        .Skip((pagination.PageNumber - 1) * pagination.PageSize)
        .Take(pagination.PageSize)
        .ToListAsync();

    return new PaginatedDto<WorkoutDto>
    {
        Data = _mapper.Map<List<WorkoutDto>>(workouts),
        TotalCount = totalCount,
        PageNumber = pagination.PageNumber,
        PageSize = pagination.PageSize
    };
}
```

### Caching Strategy

**Response Caching**:
```csharp
[HttpGet("types")]
[ResponseCache(Duration = 3600)] // Cache for 1 hour
public async Task<ActionResult<List<WorkoutTypeViewModel>>> GetWorkoutTypes()
{
    var types = await _workoutService.GetWorkoutTypesAsync();
    return Ok(_mapper.Map<List<WorkoutTypeViewModel>>(types));
}
```

## 🧪 Testing Strategy

### Unit Testing

**Service Testing Example**:
```csharp
[Test]
public async Task CreateWorkout_ValidData_ReturnsWorkoutDto()
{
    // Arrange
    var createDto = new CreateWorkoutDto { Name = "Test Workout" };
    var workout = new Workout { Id = 1, Name = "Test Workout" };
    
    _mockRepository.Setup(r => r.CreateAsync(It.IsAny<Workout>()))
        .ReturnsAsync(workout);
    
    // Act
    var result = await _workoutService.CreateWorkout(createDto);
    
    // Assert
    Assert.That(result.Name, Is.EqualTo("Test Workout"));
    _mockRepository.Verify(r => r.CreateAsync(It.IsAny<Workout>()), Times.Once);
}
```

### Integration Testing

**Controller Testing**:
```csharp
[Test]
public async Task GetWorkouts_ReturnsWorkoutList()
{
    // Arrange
    var client = _factory.CreateClient();
    var token = await GetAuthTokenAsync();
    client.DefaultRequestHeaders.Authorization = 
        new AuthenticationHeaderValue("Bearer", token);
    
    // Act
    var response = await client.GetAsync("/api/workouts");
    
    // Assert
    response.EnsureSuccessStatusCode();
    var content = await response.Content.ReadAsStringAsync();
    var workouts = JsonSerializer.Deserialize<PaginatedViewModel<WorkoutViewModel>>(content);
    
    Assert.That(workouts.Data, Is.Not.Empty);
}
```

---

*This document covers the complete backend architecture. For specific implementation details, refer to the source code and related documentation.*