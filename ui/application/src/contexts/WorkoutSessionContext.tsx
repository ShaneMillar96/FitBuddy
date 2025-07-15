import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { 
  WorkoutSession, 
  SessionContextState, 
  SessionAction, 
  SessionStats, 
  ExerciseProgress, 
  SetProgress,
  SessionPersistence,
  SessionTimer,
  WorkoutTypeProgress
} from '@/interfaces/workout-session';
import { Workout, WorkoutExercise } from '@/interfaces/workout';
import { v4 as uuidv4 } from 'uuid';
import { WORKOUT_TYPES, WorkoutTypeData, WorkoutTypeId } from '@/interfaces/workout-types';

// Local storage keys
const STORAGE_KEY = 'fitbuddy_workout_session';
const ACTIVE_SESSION_KEY = 'fitbuddy_active_session';

// Initial state
const initialState: SessionContextState = {
  currentSession: null,
  isSessionActive: false,
  timer: {
    type: 'total',
    mode: 'stopwatch',
    isRunning: false,
    isPaused: false,
    startTime: null,
    pausedAt: null,
    totalPausedTime: 0,
    currentTime: 0
  },
  stats: null,
  persistence: {
    sessions: {},
    activeSessionId: null,
    lastUpdated: new Date()
  }
};

// Utility functions
const calculateStats = (session: WorkoutSession): SessionStats => {
  const totalExercises = session.exerciseProgress.length;
  const completedExercises = session.exerciseProgress.filter(ex => ex.status === 'completed').length;
  const skippedExercises = session.exerciseProgress.filter(ex => ex.status === 'skipped').length;
  
  const totalSets = session.exerciseProgress.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSets = session.exerciseProgress.reduce((sum, ex) => 
    sum + ex.sets.filter(set => set.status === 'completed').length, 0);
  
  const totalVolume = session.exerciseProgress.reduce((sum, ex) => 
    sum + ex.sets.reduce((setSum, set) => {
      if (set.status === 'completed' && set.actualWeightKg && set.actualReps) {
        return setSum + (set.actualWeightKg * set.actualReps);
      }
      return setSum;
    }, 0), 0);
  
  const completedSetsData = session.exerciseProgress.flatMap(ex => 
    ex.sets.filter(set => set.status === 'completed' && set.startTime && set.endTime));
  
  const averageSetTime = completedSetsData.length > 0 ? 
    completedSetsData.reduce((sum, set) => {
      const duration = set.endTime!.getTime() - set.startTime!.getTime();
      return sum + (duration / 1000);
    }, 0) / completedSetsData.length : 0;
  
  const averageRestTime = completedSetsData.length > 0 ? 
    completedSetsData.reduce((sum, set) => sum + (set.actualRestSeconds || 0), 0) / completedSetsData.length : 0;
  
  const completionPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  return {
    totalExercises,
    completedExercises,
    skippedExercises,
    totalSets,
    completedSets,
    totalVolume,
    averageRestTime,
    averageSetTime,
    personalRecords: [], // TODO: Calculate personal records
    completionPercentage
  };
};

const createExerciseProgress = (exercises: WorkoutExercise[]): ExerciseProgress[] => {
  return exercises.map(workoutExercise => ({
    exerciseId: workoutExercise.exerciseId,
    exercise: workoutExercise.exercise,
    orderInWorkout: workoutExercise.orderInWorkout,
    status: 'not_started',
    startTime: null,
    endTime: null,
    totalTime: 0,
    sets: Array.from({ length: workoutExercise.sets || 1 }, (_, index) => ({
      setNumber: index + 1,
      status: 'not_started',
      startTime: null,
      endTime: null,
      restStartTime: null,
      restEndTime: null,
      actualRestSeconds: undefined
    })),
    plannedSets: workoutExercise.sets,
    plannedReps: workoutExercise.reps,
    plannedWeightKg: workoutExercise.weightKg,
    plannedDistanceMeters: workoutExercise.distanceMeters,
    plannedDurationSeconds: workoutExercise.durationSeconds,
    plannedRestSeconds: workoutExercise.restSeconds
  }));
};

const initializeWorkoutTypeProgress = (workoutTypeId?: WorkoutTypeId, workoutTypeData?: WorkoutTypeData): WorkoutTypeProgress => {
  const progress: WorkoutTypeProgress = {};
  
  if (!workoutTypeId || !workoutTypeData) return progress;
  
  switch (workoutTypeId) {
    case WORKOUT_TYPES.EMOM:
      progress.currentRound = 1;
      progress.roundsCompleted = 0;
      progress.currentMinute = 1;
      progress.minutesCompleted = 0;
      break;
      
    case WORKOUT_TYPES.AMRAP:
      progress.currentRoundInProgress = 1;
      progress.partialRoundProgress = 0;
      progress.timeRemaining = (workoutTypeData as any).timeCapMinutes * 60;
      break;
      
    case WORKOUT_TYPES.FOR_TIME:
      progress.sequentialProgress = 0;
      progress.splitTimes = [];
      break;
      
    case WORKOUT_TYPES.TABATA:
      progress.currentInterval = 1;
      progress.currentPhase = 'work';
      progress.phaseTimeRemaining = (workoutTypeData as any).exercises?.[0]?.workTimeSeconds || 20;
      progress.intervalsCompleted = 0;
      break;
      
    case WORKOUT_TYPES.LADDER:
      progress.currentStep = 0;
      progress.currentStepReps = (workoutTypeData as any).exercises?.[0]?.startReps || 0;
      progress.stepsCompleted = 0;
      progress.ladderDirection = (workoutTypeData as any).ladderType || 'ascending';
      break;
  }
  
  progress.totalVolume = 0;
  progress.estimatedCompletion = 0;
  
  return progress;
};

const saveToLocalStorage = (state: SessionContextState) => {
  try {
    if (state.currentSession) {
      const persistence: SessionPersistence = {
        sessions: {
          ...state.persistence.sessions,
          [state.currentSession.id]: state.currentSession
        },
        activeSessionId: state.currentSession.id,
        lastUpdated: new Date()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistence));
    } else {
      const persistence: SessionPersistence = {
        ...state.persistence,
        activeSessionId: null,
        lastUpdated: new Date()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistence));
    }
  } catch (error) {
    console.error('Failed to save session to localStorage:', error);
  }
};

const loadFromLocalStorage = (): Partial<SessionContextState> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const persistence: SessionPersistence = JSON.parse(stored);
      
      // Convert date strings back to Date objects
      Object.values(persistence.sessions).forEach(session => {
        session.createdAt = new Date(session.createdAt);
        session.updatedAt = new Date(session.updatedAt);
        if (session.startTime) session.startTime = new Date(session.startTime);
        if (session.endTime) session.endTime = new Date(session.endTime);
        
        session.exerciseProgress.forEach(exercise => {
          if (exercise.startTime) exercise.startTime = new Date(exercise.startTime);
          if (exercise.endTime) exercise.endTime = new Date(exercise.endTime);
          
          exercise.sets.forEach(set => {
            if (set.startTime) set.startTime = new Date(set.startTime);
            if (set.endTime) set.endTime = new Date(set.endTime);
            if (set.restStartTime) set.restStartTime = new Date(set.restStartTime);
            if (set.restEndTime) set.restEndTime = new Date(set.restEndTime);
          });
        });
      });
      
      const activeSession = persistence.activeSessionId ? 
        persistence.sessions[persistence.activeSessionId] : null;
      
      return {
        currentSession: activeSession,
        isSessionActive: !!activeSession && activeSession.sessionStatus === 'active',
        persistence,
        stats: activeSession ? calculateStats(activeSession) : null
      };
    }
  } catch (error) {
    console.error('Failed to load session from localStorage:', error);
  }
  return {};
};

// Reducer
const sessionReducer = (state: SessionContextState, action: SessionAction): SessionContextState => {
  switch (action.type) {
    case 'START_SESSION': {
      const { workout, exercises, workoutTypeData } = action.payload;
      const session: WorkoutSession = {
        id: uuidv4(),
        workoutId: workout.id,
        workout,
        startTime: new Date(),
        endTime: null,
        currentExerciseIndex: 0,
        sessionStatus: 'active',
        totalElapsedTime: 0,
        exerciseProgress: createExerciseProgress(exercises),
        workoutTypeId: workout.workoutTypeId,
        workoutTypeData,
        workoutTypeProgress: initializeWorkoutTypeProgress(workout.workoutTypeId, workoutTypeData),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const newTimer: SessionTimer = {
        ...state.timer,
        type: 'total',
        mode: 'stopwatch',
        isRunning: true,
        isPaused: false,
        startTime: new Date(),
        currentTime: 0
      };
      
      return {
        ...state,
        currentSession: session,
        isSessionActive: true,
        timer: newTimer,
        stats: calculateStats(session)
      };
    }
    
    case 'PAUSE_SESSION': {
      if (!state.currentSession) return state;
      
      const updatedSession = {
        ...state.currentSession,
        sessionStatus: 'paused' as const,
        updatedAt: new Date()
      };
      
      const updatedTimer = {
        ...state.timer,
        isRunning: false,
        isPaused: true,
        pausedAt: new Date()
      };
      
      return {
        ...state,
        currentSession: updatedSession,
        timer: updatedTimer,
        stats: calculateStats(updatedSession)
      };
    }
    
    case 'RESUME_SESSION': {
      if (!state.currentSession) return state;
      
      const now = new Date();
      const pausedDuration = state.timer.pausedAt ? 
        (now.getTime() - state.timer.pausedAt.getTime()) / 1000 : 0;
      
      const updatedSession = {
        ...state.currentSession,
        sessionStatus: 'active' as const,
        updatedAt: now
      };
      
      const updatedTimer = {
        ...state.timer,
        isRunning: true,
        isPaused: false,
        pausedAt: null,
        totalPausedTime: state.timer.totalPausedTime + pausedDuration
      };
      
      return {
        ...state,
        currentSession: updatedSession,
        timer: updatedTimer,
        stats: calculateStats(updatedSession)
      };
    }
    
    case 'END_SESSION': {
      if (!state.currentSession) return state;
      
      const updatedSession = {
        ...state.currentSession,
        sessionStatus: 'completed' as const,
        endTime: new Date(),
        updatedAt: new Date()
      };
      
      const updatedTimer = {
        ...state.timer,
        isRunning: false,
        isPaused: false
      };
      
      return {
        ...state,
        currentSession: updatedSession,
        isSessionActive: false,
        timer: updatedTimer,
        stats: calculateStats(updatedSession)
      };
    }
    
    case 'ABANDON_SESSION': {
      if (!state.currentSession) return state;
      
      const updatedSession = {
        ...state.currentSession,
        sessionStatus: 'abandoned' as const,
        endTime: new Date(),
        updatedAt: new Date()
      };
      
      return {
        ...state,
        currentSession: updatedSession,
        isSessionActive: false,
        timer: initialState.timer,
        stats: calculateStats(updatedSession)
      };
    }
    
    case 'START_EXERCISE': {
      if (!state.currentSession) return state;
      
      const { exerciseIndex } = action.payload;
      const updatedProgress = [...state.currentSession.exerciseProgress];
      
      if (updatedProgress[exerciseIndex]) {
        updatedProgress[exerciseIndex] = {
          ...updatedProgress[exerciseIndex],
          status: 'in_progress',
          startTime: new Date()
        };
      }
      
      const updatedSession = {
        ...state.currentSession,
        currentExerciseIndex: exerciseIndex,
        exerciseProgress: updatedProgress,
        updatedAt: new Date()
      };
      
      return {
        ...state,
        currentSession: updatedSession,
        stats: calculateStats(updatedSession)
      };
    }
    
    case 'COMPLETE_EXERCISE': {
      if (!state.currentSession) return state;
      
      const { exerciseIndex } = action.payload;
      const updatedProgress = [...state.currentSession.exerciseProgress];
      
      if (updatedProgress[exerciseIndex]) {
        const exercise = updatedProgress[exerciseIndex];
        const now = new Date();
        const totalTime = exercise.startTime ? 
          (now.getTime() - exercise.startTime.getTime()) / 1000 : 0;
        
        updatedProgress[exerciseIndex] = {
          ...exercise,
          status: 'completed',
          endTime: now,
          totalTime
        };
      }
      
      const updatedSession = {
        ...state.currentSession,
        exerciseProgress: updatedProgress,
        updatedAt: new Date()
      };
      
      return {
        ...state,
        currentSession: updatedSession,
        stats: calculateStats(updatedSession)
      };
    }
    
    case 'SKIP_EXERCISE': {
      if (!state.currentSession) return state;
      
      const { exerciseIndex } = action.payload;
      const updatedProgress = [...state.currentSession.exerciseProgress];
      
      if (updatedProgress[exerciseIndex]) {
        updatedProgress[exerciseIndex] = {
          ...updatedProgress[exerciseIndex],
          status: 'skipped',
          endTime: new Date()
        };
      }
      
      const updatedSession = {
        ...state.currentSession,
        exerciseProgress: updatedProgress,
        updatedAt: new Date()
      };
      
      return {
        ...state,
        currentSession: updatedSession,
        stats: calculateStats(updatedSession)
      };
    }
    
    case 'START_SET': {
      if (!state.currentSession) return state;
      
      const { exerciseIndex, setNumber } = action.payload;
      const updatedProgress = [...state.currentSession.exerciseProgress];
      
      if (updatedProgress[exerciseIndex]) {
        const sets = [...updatedProgress[exerciseIndex].sets];
        const setIndex = setNumber - 1;
        
        if (sets[setIndex]) {
          sets[setIndex] = {
            ...sets[setIndex],
            status: 'in_progress',
            startTime: new Date()
          };
        }
        
        updatedProgress[exerciseIndex] = {
          ...updatedProgress[exerciseIndex],
          sets
        };
      }
      
      const updatedSession = {
        ...state.currentSession,
        exerciseProgress: updatedProgress,
        updatedAt: new Date()
      };
      
      return {
        ...state,
        currentSession: updatedSession,
        stats: calculateStats(updatedSession)
      };
    }
    
    case 'COMPLETE_SET': {
      if (!state.currentSession) return state;
      
      const { exerciseIndex, setNumber, setData } = action.payload;
      const updatedProgress = [...state.currentSession.exerciseProgress];
      
      if (updatedProgress[exerciseIndex]) {
        const sets = [...updatedProgress[exerciseIndex].sets];
        const setIndex = setNumber - 1;
        
        if (sets[setIndex]) {
          sets[setIndex] = {
            ...sets[setIndex],
            ...setData,
            status: 'completed',
            endTime: new Date()
          };
        }
        
        updatedProgress[exerciseIndex] = {
          ...updatedProgress[exerciseIndex],
          sets
        };
      }
      
      const updatedSession = {
        ...state.currentSession,
        exerciseProgress: updatedProgress,
        updatedAt: new Date()
      };
      
      return {
        ...state,
        currentSession: updatedSession,
        stats: calculateStats(updatedSession)
      };
    }
    
    case 'UPDATE_TIMER': {
      return {
        ...state,
        timer: {
          ...state.timer,
          ...action.payload
        }
      };
    }
    
    case 'UPDATE_WORKOUT_TYPE_PROGRESS': {
      if (!state.currentSession) return state;
      
      const updatedSession = {
        ...state.currentSession,
        workoutTypeProgress: {
          ...state.currentSession.workoutTypeProgress,
          ...action.payload
        },
        updatedAt: new Date()
      };
      
      return {
        ...state,
        currentSession: updatedSession,
        stats: calculateStats(updatedSession)
      };
    }
    
    case 'LOAD_SESSION': {
      const session = action.payload;
      return {
        ...state,
        currentSession: session,
        isSessionActive: session.sessionStatus === 'active',
        stats: calculateStats(session)
      };
    }
    
    case 'CLEAR_SESSION': {
      return {
        ...state,
        currentSession: null,
        isSessionActive: false,
        timer: initialState.timer,
        stats: null
      };
    }
    
    default:
      return state;
  }
};

// Context
const WorkoutSessionContext = createContext<{
  state: SessionContextState;
  dispatch: React.Dispatch<SessionAction>;
  startSession: (workout: Workout, exercises: WorkoutExercise[], workoutTypeData?: WorkoutTypeData) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: (result: any) => void;
  abandonSession: () => void;
  startExercise: (exerciseIndex: number) => void;
  completeExercise: (exerciseIndex: number) => void;
  skipExercise: (exerciseIndex: number) => void;
  startSet: (exerciseIndex: number, setNumber: number) => void;
  completeSet: (exerciseIndex: number, setNumber: number, setData: Partial<SetProgress>) => void;
  updateWorkoutTypeProgress: (progress: Partial<WorkoutTypeProgress>) => void;
  clearSession: () => void;
} | null>(null);

// Provider
export const WorkoutSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(sessionReducer, initialState, (initial) => {
    const loaded = loadFromLocalStorage();
    return { ...initial, ...loaded };
  });

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    saveToLocalStorage(state);
  }, [state]);

  // Update timer every second when running
  useEffect(() => {
    if (!state.timer.isRunning) return;

    const interval = setInterval(() => {
      const now = new Date();
      if (state.timer.startTime) {
        const elapsed = (now.getTime() - state.timer.startTime.getTime()) / 1000;
        const adjustedElapsed = elapsed - state.timer.totalPausedTime;
        
        dispatch({
          type: 'UPDATE_TIMER',
          payload: { currentTime: adjustedElapsed }
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.timer.isRunning, state.timer.startTime, state.timer.totalPausedTime]);

  // Action creators
  const startSession = useCallback((workout: Workout, exercises: WorkoutExercise[], workoutTypeData?: WorkoutTypeData) => {
    dispatch({ type: 'START_SESSION', payload: { workout, exercises, workoutTypeData } });
  }, []);

  const pauseSession = useCallback(() => {
    dispatch({ type: 'PAUSE_SESSION' });
  }, []);

  const resumeSession = useCallback(() => {
    dispatch({ type: 'RESUME_SESSION' });
  }, []);

  const endSession = useCallback((result: any) => {
    dispatch({ type: 'END_SESSION', payload: result });
  }, []);

  const abandonSession = useCallback(() => {
    dispatch({ type: 'ABANDON_SESSION' });
  }, []);

  const startExercise = useCallback((exerciseIndex: number) => {
    dispatch({ type: 'START_EXERCISE', payload: { exerciseIndex } });
  }, []);

  const completeExercise = useCallback((exerciseIndex: number) => {
    dispatch({ type: 'COMPLETE_EXERCISE', payload: { exerciseIndex } });
  }, []);

  const skipExercise = useCallback((exerciseIndex: number) => {
    dispatch({ type: 'SKIP_EXERCISE', payload: { exerciseIndex } });
  }, []);

  const startSet = useCallback((exerciseIndex: number, setNumber: number) => {
    dispatch({ type: 'START_SET', payload: { exerciseIndex, setNumber } });
  }, []);

  const completeSet = useCallback((exerciseIndex: number, setNumber: number, setData: Partial<SetProgress>) => {
    dispatch({ type: 'COMPLETE_SET', payload: { exerciseIndex, setNumber, setData } });
  }, []);

  const clearSession = useCallback(() => {
    dispatch({ type: 'CLEAR_SESSION' });
  }, []);

  const updateWorkoutTypeProgress = useCallback((progress: Partial<WorkoutTypeProgress>) => {
    dispatch({ type: 'UPDATE_WORKOUT_TYPE_PROGRESS', payload: progress });
  }, []);

  const value = {
    state,
    dispatch,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    abandonSession,
    startExercise,
    completeExercise,
    skipExercise,
    startSet,
    completeSet,
    updateWorkoutTypeProgress,
    clearSession
  };

  return (
    <WorkoutSessionContext.Provider value={value}>
      {children}
    </WorkoutSessionContext.Provider>
  );
};

// Hook
export const useWorkoutSession = () => {
  const context = useContext(WorkoutSessionContext);
  if (!context) {
    throw new Error('useWorkoutSession must be used within a WorkoutSessionProvider');
  }
  return context;
};