# Authentication System

## 🔐 Overview

FitBuddy implements a secure JWT-based authentication system for user management, registration, and session handling. The system provides seamless user experience while maintaining security best practices.

## 🎯 Key Features

### 1. User Registration
- **Account Creation**: Email and username registration
- **Password Security**: bcrypt hashing with secure salts
- **Validation**: Email format and password strength validation
- **Duplicate Prevention**: Unique email and username constraints

### 2. User Login
- **Credential Authentication**: Email/username and password
- **JWT Token Generation**: Secure token-based authentication
- **Session Management**: Automatic token refresh and expiration
- **Remember Me**: Persistent login sessions

### 3. Session Management
- **Token Validation**: Automatic token verification
- **Auto-logout**: Session expiration handling
- **Protected Routes**: Access control for authenticated users
- **User Context**: Global user state management

## 🛠️ Technical Implementation

### Backend Architecture

#### Models and Entities

**Member Entity**:
```csharp
public class Member
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }
    
    // Navigation properties
    public ICollection<Workout> Workouts { get; set; } = new List<Workout>();
    public ICollection<WorkoutResult> WorkoutResults { get; set; } = new List<WorkoutResult>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<WorkoutFavorite> WorkoutFavorites { get; set; } = new List<WorkoutFavorite>();
}
```

#### Authentication Service

**IAuthenticationService Interface**:
```csharp
public interface IAuthenticationService
{
    Task<AuthenticationResult> RegisterAsync(RegisterDto registerDto);
    Task<AuthenticationResult> LoginAsync(LoginDto loginDto);
    Task<bool> ValidateTokenAsync(string token);
    Task<Member?> GetMemberByIdAsync(int id);
    string GenerateJwtToken(Member member);
    bool VerifyPassword(string password, string hash);
    string HashPassword(string password);
}
```

**AuthenticationService Implementation**:
```csharp
public class AuthenticationService : IAuthenticationService
{
    private readonly IMemberRepository _memberRepository;
    private readonly IConfiguration _configuration;
    private readonly IMapper _mapper;

    public async Task<AuthenticationResult> RegisterAsync(RegisterDto registerDto)
    {
        // Check if user already exists
        var existingMember = await _memberRepository.GetMemberByEmailAsync(registerDto.Email);
        if (existingMember != null)
        {
            return new AuthenticationResult 
            { 
                Success = false, 
                Message = "User with this email already exists" 
            };
        }

        // Create new member
        var member = new Member
        {
            Username = registerDto.Username,
            Email = registerDto.Email,
            PasswordHash = HashPassword(registerDto.Password),
            CreatedDate = DateTime.UtcNow
        };

        var createdMember = await _memberRepository.CreateAsync(member);
        var token = GenerateJwtToken(createdMember);

        return new AuthenticationResult
        {
            Success = true,
            Token = token,
            Member = _mapper.Map<MemberDto>(createdMember)
        };
    }

    public async Task<AuthenticationResult> LoginAsync(LoginDto loginDto)
    {
        var member = await _memberRepository.GetMemberByEmailAsync(loginDto.Email);
        
        if (member == null || !VerifyPassword(loginDto.Password, member.PasswordHash))
        {
            return new AuthenticationResult 
            { 
                Success = false, 
                Message = "Invalid email or password" 
            };
        }

        var token = GenerateJwtToken(member);
        return new AuthenticationResult
        {
            Success = true,
            Token = token,
            Member = _mapper.Map<MemberDto>(member)
        };
    }

    public string GenerateJwtToken(Member member)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, member.Id.ToString()),
            new Claim(ClaimTypes.Name, member.Username),
            new Claim(ClaimTypes.Email, member.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, 
                new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString(), 
                ClaimValueTypes.Integer64)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Secret"]));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["JwtSettings:Issuer"],
            audience: _configuration["JwtSettings:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, BCrypt.Net.BCrypt.GenerateSalt());
    }

    public bool VerifyPassword(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }
}
```

#### JWT Configuration

**Program.cs Configuration**:
```csharp
// JWT Authentication Configuration
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Secret"])),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// Authorization
builder.Services.AddAuthorization();
```

#### API Controllers

**AccountController**:
```csharp
[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly IAuthenticationService _authService;
    private readonly IMapper _mapper;

    [HttpPost("register")]
    public async Task<ActionResult<AuthenticationResponse>> Register(
        [FromBody] RegisterRequestModel model)
    {
        var registerDto = _mapper.Map<RegisterDto>(model);
        var result = await _authService.RegisterAsync(registerDto);

        if (!result.Success)
        {
            return BadRequest(new { message = result.Message });
        }

        var response = new AuthenticationResponse
        {
            Token = result.Token,
            User = _mapper.Map<UserViewModel>(result.Member)
        };

        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthenticationResponse>> Login(
        [FromBody] LoginRequestModel model)
    {
        var loginDto = _mapper.Map<LoginDto>(model);
        var result = await _authService.LoginAsync(loginDto);

        if (!result.Success)
        {
            return BadRequest(new { message = result.Message });
        }

        var response = new AuthenticationResponse
        {
            Token = result.Token,
            User = _mapper.Map<UserViewModel>(result.Member)
        };

        return Ok(response);
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<ActionResult<UserViewModel>> GetProfile()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var member = await _authService.GetMemberByIdAsync(userId);

        if (member == null)
        {
            return NotFound();
        }

        return Ok(_mapper.Map<UserViewModel>(member));
    }

    [HttpPost("logout")]
    [Authorize]
    public IActionResult Logout()
    {
        // In a JWT system, logout is typically handled client-side
        // by removing the token from storage
        return Ok(new { message = "Logged out successfully" });
    }
}
```

### Frontend Architecture

#### Authentication Context

**AuthContext Implementation**:
```typescript
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('fitbuddy_token');
    if (token) {
      // Validate token and get user profile
      validateTokenAndGetProfile(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateTokenAndGetProfile = async (token: string) => {
    try {
      // Set authorization header
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Get user profile
      const response = await axiosInstance.get('/api/account/profile');
      setUser(response.data);
    } catch (error) {
      // Token is invalid, remove it
      localStorage.removeItem('fitbuddy_token');
      delete axiosInstance.defaults.headers.common['Authorization'];
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await axiosInstance.post('/api/account/login', credentials);
      const { token, user } = response.data;
      
      // Store token and user
      localStorage.setItem('fitbuddy_token', token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await axiosInstance.post('/api/account/register', userData);
      const { token, user } = response.data;
      
      // Store token and user
      localStorage.setItem('fitbuddy_token', token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('fitbuddy_token');
    delete axiosInstance.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

#### Login Component

**Login Form**:
```typescript
const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await login(data);
      
      // Redirect to intended page or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-xl"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to your FitBuddy account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <Link
            to="/register"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Don't have an account? Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
```

#### Protected Routes

**PrivateRoute Component**:
```typescript
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
```

#### Axios Interceptor

**API Request Interceptor**:
```typescript
// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fitbuddy_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Token expired, logout user
      localStorage.removeItem('fitbuddy_token');
      delete axiosInstance.defaults.headers.common['Authorization'];
      
      // Redirect to login
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
```

## 🔒 Security Implementation

### Password Security

**Password Hashing**:
```csharp
public string HashPassword(string password)
{
    // Use BCrypt with automatic salt generation
    return BCrypt.Net.BCrypt.HashPassword(password, BCrypt.Net.BCrypt.GenerateSalt(12));
}

public bool VerifyPassword(string password, string hash)
{
    return BCrypt.Net.BCrypt.Verify(password, hash);
}
```

### JWT Token Security

**Token Configuration**:
```json
{
  "JwtSettings": {
    "Secret": "your-super-secret-key-that-should-be-at-least-32-characters-long",
    "Issuer": "FitBuddy",
    "Audience": "FitBuddy-Users",
    "ExpiryInHours": 24
  }
}
```

### Input Validation

**Frontend Validation**:
```typescript
const loginSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

const registerSchema = yup.object({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username cannot exceed 50 characters')
    .required('Username is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required')
});
```

**Backend Validation**:
```csharp
public class RegisterDto
{
    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 8)]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$", 
        ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, and one number")]
    public string Password { get; set; } = string.Empty;
}
```

## 🧪 Testing

### Backend Testing

**Authentication Service Tests**:
```csharp
[Test]
public async Task RegisterAsync_ValidUser_ReturnsSuccessResult()
{
    // Arrange
    var registerDto = new RegisterDto
    {
        Username = "testuser",
        Email = "test@example.com",
        Password = "TestPassword123"
    };

    _mockMemberRepository.Setup(r => r.GetMemberByEmailAsync(It.IsAny<string>()))
        .ReturnsAsync((Member)null);

    // Act
    var result = await _authService.RegisterAsync(registerDto);

    // Assert
    Assert.That(result.Success, Is.True);
    Assert.That(result.Token, Is.Not.Null);
    Assert.That(result.Member.Email, Is.EqualTo(registerDto.Email));
}

[Test]
public async Task LoginAsync_ValidCredentials_ReturnsSuccessResult()
{
    // Arrange
    var loginDto = new LoginDto
    {
        Email = "test@example.com",
        Password = "TestPassword123"
    };

    var member = new Member
    {
        Id = 1,
        Email = "test@example.com",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("TestPassword123")
    };

    _mockMemberRepository.Setup(r => r.GetMemberByEmailAsync(loginDto.Email))
        .ReturnsAsync(member);

    // Act
    var result = await _authService.LoginAsync(loginDto);

    // Assert
    Assert.That(result.Success, Is.True);
    Assert.That(result.Token, Is.Not.Null);
}
```

### Frontend Testing

**Login Component Tests**:
```typescript
describe('Login', () => {
  it('submits login form with valid credentials', async () => {
    const mockLogin = jest.fn();
    const mockNavigate = jest.fn();

    render(<Login />, { wrapper: AuthTestWrapper });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
});
```

## 🚀 Future Enhancements

### Planned Features

- **Two-Factor Authentication**: SMS or email-based 2FA
- **Social Login**: Google, Facebook, Apple sign-in
- **Password Reset**: Email-based password recovery
- **Account Verification**: Email verification for new accounts
- **Session Management**: Multiple device sessions
- **Account Lockout**: Protection against brute force attacks

### Security Improvements

- **Refresh Tokens**: Automatic token refresh mechanism
- **Device Tracking**: Monitor login devices and locations
- **Security Logs**: Audit trail for security events
- **Rate Limiting**: API rate limiting for authentication endpoints
- **CAPTCHA**: Bot protection for login and registration

---

*This authentication system provides secure, user-friendly access to the FitBuddy application while maintaining industry security standards.*