# Dynamic Workout Type System

## 🎯 Overview

The Dynamic Workout Type System is an advanced feature that provides workout-type specific interfaces for creating CrossFit workouts. Instead of using generic Sets/Reps/Time/Rest fields for all workouts, each workout type (EMOM, AMRAP, For Time, Tabata, Ladder) has its own specialized input interface that matches the unique structure and requirements of that workout style.

## 🏗️ Architecture

### Core Components

```
📁 src/components/workout/
├── 📄 WorkoutBuilder.tsx              # Main orchestrator component
├── 📄 ExercisePicker.tsx             # Shared exercise selection modal
└── 📁 builders/
    ├── 📄 EMOMBuilder.tsx            # Every Minute on the Minute interface
    ├── 📄 AMRAPBuilder.tsx           # As Many Rounds As Possible interface
    ├── 📄 ForTimeBuilder.tsx         # For Time interface
    ├── 📄 TabataBuilder.tsx          # Tabata Protocol interface
    └── 📄 LadderBuilder.tsx          # Ladder/Progression interface
```

### Type System

```typescript
// Core workout type constants
export const WORKOUT_TYPES = {
  EMOM: 1,        // Every Minute on the Minute
  AMRAP: 2,       // As Many Rounds As Possible  
  FOR_TIME: 3,    // For Time
  TABATA: 4,      // Tabata Protocol
  LADDER: 5       // Ladder/Progression
} as const;

// Base exercise interface
export interface BaseWorkoutExercise {
  exerciseId: number;
  orderInWorkout: number;
  weightDescription?: string;
  notes?: string;
  name?: string;
}

// Workout-type specific exercise interfaces
export interface EMOMExercise extends BaseWorkoutExercise {
  minute: number;              // Which minute (1, 2, 3...)
  reps: number;               // Reps to complete in that minute
  restBetweenMinutes?: number; // Optional rest between minutes
}

export interface AMRAPExercise extends BaseWorkoutExercise {
  reps: number;               // Reps per round
  roundPosition: number;      // Order within the round
}

export interface ForTimeExercise extends BaseWorkoutExercise {
  reps: number;               // Total reps to complete
  rounds?: number;            // If it's multiple rounds
}

export interface TabataExercise extends BaseWorkoutExercise {
  workTimeSeconds: number;    // Work interval (usually 20s)
  restTimeSeconds: number;    // Rest interval (usually 10s)
  rounds: number;             // Number of Tabata rounds
  exercisePosition: number;   // Order if multiple exercises
}

export interface LadderExercise extends BaseWorkoutExercise {
  ladderType: 'ascending' | 'descending' | 'pyramid';
  startReps: number;          // Starting number
  endReps: number;            // Ending number
  increment: number;          // Step size
  ladderPosition: number;     // Order in ladder sequence
}
```

## 🎨 User Interface Design

### EMOM Builder (Blue Theme) ⏰
- **Minute-by-Minute Timeline**: Visual grid showing each minute of the workout
- **Exercise Assignment**: Drag-and-drop or click-to-add exercises to specific minutes
- **Real-time Duration**: Displays total workout time based on minute count
- **Rest Considerations**: Built-in warnings for overloaded minutes

**Key Features:**
- Total minute configuration (1-60 minutes)
- Exercise assignment to specific minutes
- Rep count per exercise per minute
- Visual timeline with minute markers
- Overflow warnings for excessive volume per minute

### AMRAP Builder (Orange Theme) 🔄
- **Round Definition**: Define the exercises that make up one round
- **Time Cap Configuration**: Set the total workout duration
- **Exercise Ordering**: Drag-and-drop to reorder exercises within the round
- **Estimated Rounds**: Automatic calculation of expected rounds

**Key Features:**
- Time cap setting (1-120 minutes)
- Round exercise definition with reps
- Exercise reordering with visual controls
- Estimated completion rounds calculation
- Round summary preview

### For Time Builder (Yellow Theme) ⚡
- **Sequential Exercise List**: Define exercises to complete in order
- **Multiple Rounds Support**: Optional round configuration
- **Volume Tracking**: Total rep count across all rounds
- **Time Estimation**: Projected completion time

**Key Features:**
- Round count configuration (1-50 rounds)
- Sequential exercise definition
- Total volume calculation
- Estimated completion time
- Round vs single-sequence toggle

### Tabata Builder (Red Theme) 🔥
- **Interval Configuration**: Work/rest time settings per exercise
- **Preset Timing Options**: Quick-select common Tabata protocols
- **Multi-Exercise Support**: Different exercises with different timings
- **Total Duration Calculation**: Automatic workout time calculation

**Key Features:**
- Work time configuration (5-300 seconds)
- Rest time configuration (5-300 seconds)
- Round count per exercise (1-20 rounds)
- Preset timing buttons (Classic Tabata, Modified, HIIT, Sprint)
- Total workout duration calculation

### Ladder Builder (Purple Theme) 📈
- **Progression Pattern**: Ascending, descending, or pyramid patterns
- **Rep Scheme Configuration**: Start/end reps with increment size
- **Pattern Visualization**: Visual preview of rep progression
- **Volume Calculation**: Total reps across entire ladder

**Key Features:**
- Ladder type selection (ascending/descending/pyramid)
- Start/end rep configuration
- Increment step size
- Visual rep sequence preview
- Total volume calculation

## 🔧 Technical Implementation

### Dynamic Component Rendering

```typescript
// WorkoutBuilder.tsx - Main orchestrator
const renderWorkoutBuilder = () => {
  if (!workoutTypeId) {
    return renderDefaultBuilder(); // Legacy fallback
  }

  switch (workoutTypeId) {
    case WORKOUT_TYPES.EMOM:
      return (
        <EMOMBuilder
          workoutData={workoutTypeData as EMOMWorkoutData}
          onChange={handleWorkoutTypeDataChange}
        />
      );
    case WORKOUT_TYPES.AMRAP:
      return (
        <AMRAPBuilder
          workoutData={workoutTypeData as AMRAPWorkoutData}
          onChange={handleWorkoutTypeDataChange}
        />
      );
    // ... other cases
    default:
      return renderDefaultBuilder();
  }
};
```

### State Management Integration

```typescript
// create-workout.tsx - Page-level integration
const CreateWorkout = () => {
  const [workoutTypeData, setWorkoutTypeData] = useState<WorkoutTypeData | null>(null);
  
  // Initialize workout type data when type changes
  useEffect(() => {
    if (typeId && Object.values(WORKOUT_TYPES).includes(typeId as WorkoutTypeId)) {
      const newWorkoutTypeData = initializeWorkoutTypeData(typeId as WorkoutTypeId);
      setWorkoutTypeData(newWorkoutTypeData);
      setExercises([]); // Clear legacy exercises
    } else {
      setWorkoutTypeData(null);
    }
  }, [typeId]);

  return (
    <WorkoutBuilder
      exercises={exercises}
      onExercisesChange={setExercises}
      workoutTypeId={typeId as WorkoutTypeId}
      onWorkoutTypeDataChange={setWorkoutTypeData}
    />
  );
};
```

### Database Schema Support

```sql
-- V1.3 Migration: Workout-Type Specific Fields
ALTER TABLE workout_exercises 
ADD COLUMN workout_type_data JSONB,
ADD COLUMN minute_number INTEGER,
ADD COLUMN round_number INTEGER, 
ADD COLUMN sequence_position INTEGER;

-- Indexes for performance
CREATE INDEX idx_workout_exercises_minute 
ON workout_exercises(workout_id, minute_number) 
WHERE minute_number IS NOT NULL;

CREATE INDEX idx_workout_exercises_round 
ON workout_exercises(workout_id, round_number) 
WHERE round_number IS NOT NULL;
```

### Backend Entity Updates

```csharp
// WorkoutExercise.cs - Enhanced with workout-type fields
public class WorkoutExercise
{
    // ... existing fields ...
    
    [Column("workout_type_data", TypeName = "jsonb")]
    public JsonDocument? WorkoutTypeData { get; set; }
    
    [Column("minute_number")]
    public int? MinuteNumber { get; set; }
    
    [Column("round_number")] 
    public int? RoundNumber { get; set; }
    
    [Column("sequence_position")]
    public int? SequencePosition { get; set; }
}
```

## 🎯 Validation System

### Workout-Type Specific Validation

```typescript
// workout-validation.ts - Type-specific validation rules
export const validateWorkout = (workoutTypeId: WorkoutTypeId, workoutData: WorkoutTypeData): ValidationResult => {
  let errors: ValidationError[] = [];

  // Base validation for all types
  errors = errors.concat(validateBaseWorkout(workoutData));

  // Type-specific validation
  switch (workoutTypeId) {
    case WORKOUT_TYPES.EMOM:
      errors = errors.concat(validateEMOMWorkout(workoutData as EMOMWorkoutData));
      break;
    case WORKOUT_TYPES.AMRAP:
      errors = errors.concat(validateAMRAPWorkout(workoutData as AMRAPWorkoutData));
      break;
    // ... other cases
  }

  return {
    isValid: errors.filter(e => e.type === 'error').length === 0,
    errors: errors.filter(e => e.type === 'error'),
    warnings: errors.filter(e => e.type === 'warning')
  };
};
```

### Validation Rules by Type

**EMOM Validation:**
- Total minutes must be 1-60
- Minute numbers must be within total minutes
- Reps per minute should be reasonable (warning at >100)
- All exercises must have valid minute assignments

**AMRAP Validation:**
- Time cap must be 1-120 minutes
- Round positions must be unique and sequential
- At least one exercise required in round
- Reasonable rep counts per exercise

**For Time Validation:**
- Round count must be 1-50 (if specified)
- Total volume warnings for >1000 reps
- Sequential exercise validation
- Completion time estimation

**Tabata Validation:**
- Work time must be 5-300 seconds
- Rest time must be 5-300 seconds
- Round count must be 1-20
- Classic Tabata warnings (20s/10s×8)

**Ladder Validation:**
- Progression must make logical sense
- Start/end reps must be positive
- Increment must be positive
- Volume warnings for excessive total reps

## 🔄 Data Flow

### Workout Creation Flow

1. **Type Selection**: User selects workout type (EMOM, AMRAP, etc.)
2. **Data Initialization**: System creates appropriate workout type data structure
3. **Builder Rendering**: Dynamic component renders based on workout type
4. **Exercise Configuration**: User configures exercises using type-specific interface
5. **Real-time Validation**: System validates input with type-specific rules
6. **Data Transformation**: Workout type data is transformed for API submission
7. **Database Storage**: JSONB and relational fields store workout structure

### Component Communication

```typescript
// Parent → WorkoutBuilder → Specific Builder → ExercisePicker
const dataFlow = {
  down: "Props (workoutTypeId, workoutTypeData)",
  up: "Callbacks (onWorkoutTypeDataChange)",
  shared: "ExercisePicker modal state"
};
```

## 🎨 UI/UX Features

### Visual Design Patterns

**Color Coding by Type:**
- EMOM: Blue theme (⏰ time-focused)
- AMRAP: Orange theme (🔄 round-focused)
- For Time: Yellow theme (⚡ speed-focused)
- Tabata: Red theme (🔥 intensity-focused)
- Ladder: Purple theme (📈 progression-focused)

**Interactive Elements:**
- Drag-and-drop exercise reordering
- Click-to-add exercise assignment
- Real-time calculation displays
- Preset configuration buttons
- Visual progression indicators

**Responsive Design:**
- Mobile-first approach
- Collapsible sections on small screens
- Touch-friendly controls
- Swipe gestures for reordering

### Animation & Feedback

```typescript
// Framer Motion animations for smooth interactions
const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -20 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};
```

## 📊 Performance Considerations

### Optimization Strategies

**Frontend:**
- Component memoization for expensive renders
- Debounced input handling
- Lazy loading of builder components
- Efficient re-rendering with React.memo

**Backend:**
- JSONB indexing for workout type data
- Efficient database queries with proper joins
- AutoMapper optimization for complex mappings
- Pagination support for large workout lists

**User Experience:**
- Instant feedback on user actions
- Progressive enhancement for complex features
- Graceful degradation for unsupported browsers
- Loading states for async operations

## 🧪 Testing Strategy

### Component Testing

```typescript
// EMOMBuilder.test.tsx
describe('EMOMBuilder', () => {
  it('should add exercise to specific minute', () => {
    const mockOnChange = jest.fn();
    const initialData: EMOMWorkoutData = {
      totalMinutes: 12,
      exercises: []
    };

    render(
      <EMOMBuilder 
        workoutData={initialData} 
        onChange={mockOnChange} 
      />
    );

    // Test exercise addition to minute 1
    fireEvent.click(screen.getByText('Add to Minute 1'));
    // ... assertions
  });
});
```

### Integration Testing

```typescript
// create-workout.integration.test.tsx
describe('Dynamic Workout Creation', () => {
  it('should switch builders when workout type changes', () => {
    render(<CreateWorkout />);
    
    // Select EMOM
    fireEvent.click(screen.getByText('EMOM'));
    expect(screen.getByText('Minute-by-Minute')).toBeInTheDocument();
    
    // Switch to AMRAP
    fireEvent.click(screen.getByText('AMRAP'));
    expect(screen.getByText('Round Definition')).toBeInTheDocument();
  });
});
```

### Validation Testing

```typescript
// workout-validation.test.ts
describe('EMOM Validation', () => {
  it('should validate minute assignments', () => {
    const workoutData: EMOMWorkoutData = {
      totalMinutes: 10,
      exercises: [
        { minute: 15, reps: 10, exerciseId: 1, orderInWorkout: 1 } // Invalid minute
      ]
    };

    const result = validateWorkout(WORKOUT_TYPES.EMOM, workoutData);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      expect.objectContaining({
        message: expect.stringContaining('exceeds total workout minutes')
      })
    );
  });
});
```

## 🚀 Future Enhancements

### Planned Features

**Advanced Interactions:**
- Drag-and-drop between minutes/rounds
- Bulk exercise operations
- Template creation from existing workouts
- Copy/paste between workout types

**Enhanced Validation:**
- Machine learning-based difficulty estimation
- Exercise compatibility checking
- Fatigue modeling for exercise ordering
- Recovery time recommendations

**Mobile Features:**
- Gesture-based navigation
- Voice input for exercise selection
- Offline workout creation
- Progressive Web App capabilities

**Social Features:**
- Workout type-specific sharing
- Community templates
- Workout type leaderboards
- Collaborative workout building

### Technical Improvements

**Performance:**
- Virtual scrolling for large exercise lists
- Web Workers for complex calculations
- Service Worker caching
- Bundle splitting by workout type

**Accessibility:**
- Screen reader optimization
- Keyboard navigation
- High contrast mode
- Voice control integration

**Developer Experience:**
- Storybook documentation
- Type-safe validation schemas
- Automated visual regression testing
- Component playground

---

*This document details the complete Dynamic Workout Type System. For general workout management features, see [workout-management.md](./workout-management.md).*