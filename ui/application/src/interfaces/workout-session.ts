import { Workout } from "./workout";
import { Exercise } from "./categories";

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
  | { type: 'START_SESSION'; payload: { workout: Workout; exercises: Exercise[] } }
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
  | { type: 'LOAD_SESSION'; payload: WorkoutSession }
  | { type: 'CLEAR_SESSION' };