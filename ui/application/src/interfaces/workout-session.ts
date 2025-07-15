import { Workout } from "./workout";
import { Exercise } from "./categories";
import { WorkoutTypeData, WorkoutTypeId } from "./workout-types";

export type SessionStatus = 'not_started' | 'active' | 'paused' | 'completed' | 'abandoned';
export type TimerType = 'exercise' | 'rest' | 'total';
export type TimerMode = 'stopwatch' | 'countdown';

export interface WorkoutSession {
  id: string;
  workoutId: number;
  workout: Workout;
  startTime: Date | null;
  endTime: Date | null;
  currentExerciseIndex: number;
  sessionStatus: SessionStatus;
  totalElapsedTime: number; // in seconds
  exerciseProgress: ExerciseProgress[];
  sessionNotes?: string;
  // Workout-type-specific data
  workoutTypeId?: WorkoutTypeId;
  workoutTypeData?: WorkoutTypeData;
  workoutTypeProgress?: WorkoutTypeProgress;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExerciseProgress {
  exerciseId: number;
  exercise: Exercise;
  orderInWorkout: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  startTime: Date | null;
  endTime: Date | null;
  totalTime: number; // in seconds
  sets: SetProgress[];
  notes?: string;
  // Planned values from WorkoutExercise
  plannedSets?: number;
  plannedReps?: number;
  plannedWeightKg?: number;
  plannedDistanceMeters?: number;
  plannedDurationSeconds?: number;
  plannedRestSeconds?: number;
}

export interface SetProgress {
  setNumber: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  startTime: Date | null;
  endTime: Date | null;
  // Actual values achieved
  actualReps?: number;
  actualWeightKg?: number;
  actualDistanceMeters?: number;
  actualDurationSeconds?: number;
  restStartTime?: Date | null;
  restEndTime?: Date | null;
  actualRestSeconds?: number;
  notes?: string;
  rpe?: number; // Rate of Perceived Exertion (1-10)
}

// Workout-type-specific progress tracking
export interface WorkoutTypeProgress {
  // EMOM specific
  currentRound?: number;
  roundsCompleted?: number;
  currentMinute?: number;
  minutesCompleted?: number;
  
  // AMRAP specific
  currentRoundInProgress?: number;
  partialRoundProgress?: number;
  timeRemaining?: number;
  
  // For Time specific
  sequentialProgress?: number;
  splitTimes?: number[];
  
  // Tabata specific
  currentInterval?: number;
  currentPhase?: 'work' | 'rest';
  phaseTimeRemaining?: number;
  intervalsCompleted?: number;
  
  // Ladder specific
  currentStep?: number;
  currentStepReps?: number;
  stepsCompleted?: number;
  ladderDirection?: 'ascending' | 'descending' | 'pyramid';
  
  // Common fields
  totalVolume?: number;
  estimatedCompletion?: number;
  workoutSpecificData?: any; // For additional workout-type data
}

export interface SessionTimer {
  type: TimerType;
  mode: TimerMode;
  isRunning: boolean;
  isPaused: boolean;
  startTime: Date | null;
  pausedAt: Date | null;
  totalPausedTime: number; // in seconds
  targetDuration?: number; // for countdown timers, in seconds
  currentTime: number; // current elapsed/remaining time in seconds
}

export interface WorkoutResult {
  sessionId: string;
  workoutId: number;
  totalTime: number; // in seconds
  exercisesCompleted: number;
  exercisesSkipped: number;
  totalSets: number;
  personalRecords: PersonalRecord[];
  rating: number; // 1-5 stars
  mood: 'terrible' | 'bad' | 'okay' | 'good' | 'amazing';
  energyLevel: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  notes?: string;
  isPublic: boolean;
  achievements: string[]; // Achievement IDs or descriptions
  // Workout-type-specific results
  workoutTypeResult?: WorkoutTypeResult;
}

// Workout-type-specific result data
export interface WorkoutTypeResult {
  type: 'EMOM' | 'AMRAP' | 'FOR_TIME' | 'TABATA' | 'LADDER';
  
  // EMOM results
  roundsCompleted?: number;
  totalMinutes?: number;
  completionTime?: number;
  
  // AMRAP results
  partialRound?: number;
  timeCapMinutes?: number;
  
  // For Time results
  averageRoundTime?: number;
  exerciseSplits?: number[];
  
  // Tabata results
  intervalsCompleted?: number;
  workoutTime?: number;
  
  // Ladder results
  stepsCompleted?: number;
  totalVolume?: number;
  
  // Common fields
  completionPercentage?: number;
  workoutSpecificData?: any;
}

export interface PersonalRecord {
  exerciseId: number;
  exerciseName: string;
  recordType: 'max_weight' | 'max_reps' | 'fastest_time' | 'longest_distance' | 'total_volume';
  previousValue?: number;
  newValue: number;
  unit: string; // kg, reps, seconds, meters, etc.
  improvement: number; // percentage or absolute improvement
}

export interface SessionStats {
  totalExercises: number;
  completedExercises: number;
  skippedExercises: number;
  totalSets: number;
  completedSets: number;
  totalVolume: number; // sum of weight * reps for all completed sets
  averageRestTime: number; // in seconds
  averageSetTime: number; // in seconds
  personalRecords: PersonalRecord[];
  completionPercentage: number;
}

// Local storage structure for session persistence
export interface SessionPersistence {
  sessions: { [sessionId: string]: WorkoutSession };
  activeSessionId: string | null;
  lastUpdated: Date;
}

// Context state for managing sessions
export interface SessionContextState {
  currentSession: WorkoutSession | null;
  isSessionActive: boolean;
  timer: SessionTimer;
  stats: SessionStats | null;
  persistence: SessionPersistence;
}

// Actions for session management
export type SessionAction = 
  | { type: 'START_SESSION'; payload: { workout: Workout; exercises: Exercise[]; workoutTypeData?: WorkoutTypeData } }
  | { type: 'PAUSE_SESSION' }
  | { type: 'RESUME_SESSION' }
  | { type: 'END_SESSION'; payload: WorkoutResult }
  | { type: 'ABANDON_SESSION' }
  | { type: 'START_EXERCISE'; payload: { exerciseIndex: number } }
  | { type: 'COMPLETE_EXERCISE'; payload: { exerciseIndex: number } }
  | { type: 'SKIP_EXERCISE'; payload: { exerciseIndex: number } }
  | { type: 'START_SET'; payload: { exerciseIndex: number; setNumber: number } }
  | { type: 'COMPLETE_SET'; payload: { exerciseIndex: number; setNumber: number; setData: Partial<SetProgress> } }
  | { type: 'UPDATE_TIMER'; payload: Partial<SessionTimer> }
  | { type: 'UPDATE_WORKOUT_TYPE_PROGRESS'; payload: Partial<WorkoutTypeProgress> }
  | { type: 'LOAD_SESSION'; payload: WorkoutSession }
  | { type: 'CLEAR_SESSION' };