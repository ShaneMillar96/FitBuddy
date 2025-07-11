# Workout Management

## 🏋️ Overview

The workout management system is the core feature of FitBuddy, enabling users to create, browse, and manage CrossFit workouts. This system has been simplified to focus exclusively on CrossFit-style workouts.

## 🎯 Key Features

### 1. Workout Creation
- **Exercise Selection**: Choose from 24 essential CrossFit exercises
- **Workout Structure**: Define sets, reps, time, and rest periods
- **Workout Types**: Categorize as EMOM, AMRAP, For Time, Tabata, or Ladder
- **Difficulty Rating**: 1-5 scale for workout intensity
- **Duration Estimation**: Expected completion time

### 2. Workout Browsing
- **Simplified List View**: Clean, focused workout display
- **Search Functionality**: Find workouts by name or content
- **Sorting Options**: Newest, oldest, popular, alphabetical
- **View Modes**: Grid and list display options

### 3. Workout Details
- **Exercise Breakdown**: Detailed exercise specifications
- **Creator Information**: Who created the workout
- **Performance Stats**: Completion statistics and ratings
- **Social Features**: Comments and favorites

## 🛠️ Technical Implementation

### Backend Architecture

#### Models and Entities

**Workout Entity**:
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
    
    // CrossFit-specific properties
    public int? ScoreTypeId { get; set; }
    public int? DifficultyLevel { get; set; }
    public int? EstimatedDurationMinutes { get; set; }
    
    // Navigation properties
    public WorkoutType WorkoutType { get; set; } = null!;
    public Member CreatedBy { get; set; } = null!;
    public ScoreType? ScoreType { get; set; }
    public ICollection<WorkoutExercise> WorkoutExercises { get; set; } = new List<WorkoutExercise>();
    public ICollection<WorkoutResult> WorkoutResults { get; set; } = new List<WorkoutResult>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<WorkoutFavorite> WorkoutFavorites { get; set; } = new List<WorkoutFavorite>();
}
```

**WorkoutExercise Entity**:
```csharp
public class WorkoutExercise
{
    public int Id { get; set; }
    public int WorkoutId { get; set; }
    public int ExerciseId { get; set; }
    public int OrderInWorkout { get; set; }
    public int? Sets { get; set; }
    public int? Reps { get; set; }
    public int? TimeSeconds { get; set; }
    public int? RestSeconds { get; set; }
    public string? WeightDescription { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedDate { get; set; }
    
    // Navigation properties
    public Workout Workout { get; set; } = null!;
    public Exercise Exercise { get; set; } = null!;
}
```

#### Service Layer

**IWorkoutService Interface**:
```csharp
public interface IWorkoutService
{
    Task<PaginatedDto<WorkoutDto>> RetrieveWorkouts(PaginationDto pagination);
    Task<WorkoutDto> GetWorkoutById(int id);
    Task<WorkoutDto> CreateWorkout(CreateWorkoutDto createWorkoutDto);
    Task<WorkoutDto> UpdateWorkout(int id, UpdateWorkoutDto updateWorkoutDto);
    Task<bool> DeleteWorkout(int id);
    Task<List<WorkoutTypeDto>> GetWorkoutTypes();
    Task<List<ExerciseDto>> GetExercises();
}
```

**WorkoutService Implementation**:
```csharp
public class WorkoutService : IWorkoutService
{
    private readonly IWorkoutRepository _workoutRepository;
    private readonly IExerciseRepository _exerciseRepository;
    private readonly IMapper _mapper;

    public async Task<PaginatedDto<WorkoutDto>> RetrieveWorkouts(PaginationDto pagination)
    {
        var workouts = await _workoutRepository.GetWorkoutsAsync(pagination);
        return _mapper.Map<PaginatedDto<WorkoutDto>>(workouts);
    }

    public async Task<WorkoutDto> CreateWorkout(CreateWorkoutDto createWorkoutDto)
    {
        var workout = _mapper.Map<Workout>(createWorkoutDto);
        workout.CreatedDate = DateTime.UtcNow;
        
        var createdWorkout = await _workoutRepository.CreateAsync(workout);
        return _mapper.Map<WorkoutDto>(createdWorkout);
    }
}
```

#### API Controllers

**WorkoutsController**:
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WorkoutsController : ControllerBase
{
    private readonly IWorkoutService _workoutService;
    private readonly IMapper _mapper;

    [HttpGet]
    public async Task<ActionResult<PaginatedViewModel<WorkoutViewModel>>> GetWorkouts(
        [FromQuery] PaginationDto pagination)
    {
        var workouts = await _workoutService.RetrieveWorkouts(pagination);
        return Ok(_mapper.Map<PaginatedViewModel<WorkoutViewModel>>(workouts));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WorkoutViewModel>> GetWorkout(int id)
    {
        var workout = await _workoutService.GetWorkoutById(id);
        if (workout == null)
            return NotFound();
            
        return Ok(_mapper.Map<WorkoutViewModel>(workout));
    }

    [HttpPost]
    public async Task<ActionResult<WorkoutViewModel>> CreateWorkout(
        [FromBody] CreateWorkoutRequestModel model)
    {
        var createDto = _mapper.Map<CreateWorkoutDto>(model);
        var workout = await _workoutService.CreateWorkout(createDto);
        return CreatedAtAction(nameof(GetWorkout), new { id = workout.Id }, 
            _mapper.Map<WorkoutViewModel>(workout));
    }
}
```

### Frontend Architecture

#### Components

**WorkoutList Component**:
```typescript
const WorkoutList: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState("newest");
  const [previewWorkout, setPreviewWorkout] = useState<Workout | null>(null);
  
  const debouncedSearch = useDebounce(searchInput, 500);
  
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useWorkouts({
    pageSize: 12,
    search: debouncedSearch,
    sortBy,
    sortDirection: sortBy.includes('desc') ? 'desc' : 'asc'
  });

  const workouts = data?.pages.flatMap(page => page.data) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <WorkoutListHeader
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Workout Grid */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          {workouts.map(workout => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              viewMode={viewMode}
              onPreview={() => setPreviewWorkout(workout)}
            />
          ))}
        </div>

        {/* Load More */}
        {hasNextPage && (
          <LoadMoreButton
            onClick={() => fetchNextPage()}
            loading={isFetchingNextPage}
          />
        )}
      </div>

      {/* Preview Modal */}
      <WorkoutPreviewModal
        workout={previewWorkout}
        isOpen={!!previewWorkout}
        onClose={() => setPreviewWorkout(null)}
      />
    </div>
  );
};
```

**WorkoutCard Component**:
```typescript
interface WorkoutCardProps {
  workout: Workout;
  viewMode: 'grid' | 'list';
  onPreview: () => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, viewMode, onPreview }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
        viewMode === 'list' ? 'flex items-center space-x-4' : ''
      }`}
      whileHover={{ scale: 1.02 }}
      onClick={onPreview}
    >
      {/* CrossFit Icon */}
      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-2xl">
        🔥
      </div>

      <div className="flex-1">
        {/* Workout Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{workout.name}</h3>

        {/* Workout Type */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
            {workout.workoutTypeName}
          </span>
          {workout.difficultyLevel && (
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < workout.difficultyLevel! ? 'bg-red-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Workout Info */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="flex items-center space-x-1">
            <FaClock />
            <span>{workout.estimatedDurationMinutes || 'N/A'} min</span>
          </span>
          <span className="flex items-center space-x-1">
            <FaUser />
            <span>{workout.createdBy}</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/workouts/${workout.id}/session`);
            }}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-all duration-300"
          >
            Start Workout
          </button>
          
          <div className="flex items-center space-x-2">
            <FavoriteButton workoutId={workout.id} />
            <ShareButton workout={workout} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
```

#### Hooks

**useWorkouts Hook**:
```typescript
interface UseWorkoutsProps {
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
  search?: string;
}

export const useWorkouts = ({
  pageSize = 10,
  sortBy = "",
  sortDirection = "asc",
  search = "",
}: UseWorkoutsProps = {}) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.WORKOUTS, pageSize, sortBy, sortDirection, search],
    queryFn: ({ pageParam = 1 }) =>
      getWorkouts({ 
        pageSize, 
        pageNumber: pageParam, 
        sortBy, 
        sortDirection, 
        search
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((acc, page) => acc + page.data.length, 0);
      return totalFetched < lastPage.totalCount ? allPages.length + 1 : undefined;
    },
  });
};
```

**useWorkoutDetails Hook**:
```typescript
export const useWorkoutDetails = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.WORKOUT_DETAILS, id],
    queryFn: () => getWorkoutDetails(id),
    enabled: !!id,
  });
};
```

## 📊 Data Flow

### Workout Creation Flow

1. **User Input**: User fills out workout creation form
2. **Frontend Validation**: TypeScript interfaces validate input
3. **API Request**: POST request to `/api/workouts`
4. **Backend Validation**: Service layer validates business rules
5. **Database Storage**: Entity Framework saves workout and exercises
6. **Response**: Return created workout with ID
7. **UI Update**: React Query invalidates cache and updates list

### Workout Browsing Flow

1. **Page Load**: React Query fetches initial workout list
2. **Search/Filter**: User inputs search terms or filters
3. **Debounced Request**: API request with search parameters
4. **Database Query**: Optimized query with pagination
5. **Response**: Paginated workout list with metadata
6. **UI Rendering**: Display workouts in grid or list view
7. **Infinite Scroll**: Load more workouts as user scrolls

## 🎨 User Interface

### Design Principles

- **CrossFit Branding**: Red/orange color scheme reflecting CrossFit identity
- **Clean Layout**: Minimal, focused design without distractions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Performance**: Fast loading and smooth interactions

### Key UI Components

**Workout List Header**:
- Search bar with debounced input
- Sort dropdown with common options
- View mode toggle (grid/list)
- Create workout button

**Workout Cards**:
- CrossFit fire emoji icon
- Workout name and type
- Difficulty level indicators
- Duration and creator information
- Action buttons (Start, Favorite, Share)

**Preview Modal**:
- Workout overview tab
- Leaderboard placeholder tab
- Exercise list with specifications
- Action buttons for starting workout

## 🔧 Configuration

### Exercise Library

The system includes 24 essential CrossFit exercises:

**Bodyweight Exercises**:
- Burpees, Push-ups, Pull-ups, Air Squats
- Mountain Climbers, Jumping Jacks, High Knees
- Plank, Sit-ups, Russian Twists

**Weighted Exercises**:
- Thrusters, Deadlifts, Kettlebell Swings
- Wall Balls, Box Jumps, Double Unders

**Olympic Lifts**:
- Clean and Jerk, Snatch

**Gymnastic Movements**:
- Muscle-ups, Handstand Push-ups, Toes-to-Bar

**Cardio Exercises**:
- Rowing, Running, Bike/Assault Bike

### Workout Types

**CrossFit Classifications**:
- **EMOM**: Every Minute on the Minute
- **AMRAP**: As Many Rounds As Possible
- **For Time**: Complete as fast as possible
- **Tabata**: 4-minute high-intensity intervals
- **Ladder**: Increasing/decreasing rep schemes

## 📈 Performance Considerations

### Backend Optimization

- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: Efficient data loading with page-based pagination
- **Caching**: Response caching for frequently accessed data
- **Eager Loading**: Include related data to minimize queries

### Frontend Optimization

- **Infinite Scrolling**: Load workouts as needed
- **Debounced Search**: Prevent excessive API calls
- **Image Optimization**: Lazy loading and compressed images
- **Memoization**: React.memo and useMemo for expensive operations

## 🧪 Testing

### Backend Testing

```csharp
[Test]
public async Task CreateWorkout_ValidData_ReturnsCreatedWorkout()
{
    // Arrange
    var createDto = new CreateWorkoutDto
    {
        Name = "Test AMRAP",
        WorkoutTypeId = 2, // AMRAP
        Exercises = new List<CreateWorkoutExerciseDto>
        {
            new() { ExerciseId = 1, Sets = 3, Reps = 10 }
        }
    };

    // Act
    var result = await _workoutService.CreateWorkout(createDto);

    // Assert
    Assert.That(result.Name, Is.EqualTo("Test AMRAP"));
    Assert.That(result.Exercises, Has.Count.EqualTo(1));
}
```

### Frontend Testing

```typescript
describe('WorkoutList', () => {
  it('renders workout cards correctly', async () => {
    render(<WorkoutList />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Test Workout')).toBeInTheDocument();
    });

    expect(screen.getByText('AMRAP')).toBeInTheDocument();
    expect(screen.getByText('Start Workout')).toBeInTheDocument();
  });
});
```

## 🚀 Future Enhancements

### Planned Features

- **Advanced Search**: Filter by exercises, difficulty, duration
- **Workout Templates**: Pre-built workout templates
- **Workout Collections**: Organized workout programs
- **Social Features**: Workout sharing and collaboration
- **Mobile App**: Native mobile applications

### Technical Improvements

- **GraphQL**: More efficient data fetching
- **Real-time Updates**: WebSocket for live workout updates
- **Offline Support**: Progressive Web App capabilities
- **Analytics**: Advanced workout and performance analytics

---

*This document covers the complete workout management system. For related features, see the workout sessions and results tracking documentation.*