import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, 
  FaPause, 
  FaStop, 
  FaStepForward,
  FaFlag,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa';

import { useWorkoutDetails } from '@/hooks/useWorkoutDetails';
import { useWorkoutSession } from '@/contexts/WorkoutSessionContext';
import { useStartSession, useCompleteSession, usePauseSession, useResumeSession } from '@/hooks/useWorkoutSession';
import { WORKOUT_TYPES } from '@/interfaces/workout-types';
import { 
  EMOMSessionInterface, 
  AMRAPSessionInterface, 
  ForTimeSessionInterface, 
  TabataSessionInterface, 
  LadderSessionInterface 
} from '@/components/workout/sessions';

// Helper function to convert workout data to workout-type-specific data
const getWorkoutTypeData = (workout: any) => {
  if (!workout || !workout.workoutTypeId || !workout.workoutStructure) return null;
  
  try {
    return JSON.parse(workout.workoutStructure);
  } catch (error) {
    console.error('Failed to parse workout structure:', error);
    return null;
  }
};

// Helper function to create fallback workout data for legacy workouts
const createFallbackWorkoutData = (workout: any) => {
  const exercises = workout.workoutExercises || [];
  const workoutTypeId = workout.workoutTypeId || workout.workoutType?.id;
  
  console.log('Creating fallback workout data:', { workoutTypeId, exercises, workout });
  
  // If no exercises, create a placeholder
  if (exercises.length === 0) {
    exercises.push({
      exerciseId: 1,
      exercise: { name: 'No Exercise Data' },
      orderInWorkout: 1,
      reps: 10,
      weightKg: null,
      notes: 'This workout has no exercise data configured'
    });
  }
  
  switch (workoutTypeId) {
    case WORKOUT_TYPES.EMOM:
      return {
        roundCount: 1,
        exercisesPerRound: exercises.length,
        totalMinutes: exercises.length,
        exercises: exercises.map((ex: any, index: number) => ({
          exerciseId: ex.exerciseId,
          name: ex.exercise?.name || 'Exercise',
          orderInWorkout: ex.orderInWorkout || index + 1,
          roundPosition: index + 1,
          reps: ex.reps || 10,
          weightDescription: ex.weightKg ? `${ex.weightKg}kg` : 'Bodyweight',
          notes: ex.notes || ''
        }))
      };
      
    case WORKOUT_TYPES.AMRAP:
      return {
        timeCapMinutes: 20,
        exercises: exercises.map((ex: any, index: number) => ({
          exerciseId: ex.exerciseId,
          name: ex.exercise?.name || 'Exercise',
          orderInWorkout: ex.orderInWorkout || index + 1,
          roundPosition: index + 1,
          reps: ex.reps || 10,
          weightDescription: ex.weightKg ? `${ex.weightKg}kg` : 'Bodyweight',
          notes: ex.notes || ''
        }))
      };
      
    case WORKOUT_TYPES.FOR_TIME:
      return {
        totalRounds: 1,
        exercises: exercises.map((ex: any, index: number) => ({
          exerciseId: ex.exerciseId,
          name: ex.exercise?.name || 'Exercise',
          orderInWorkout: ex.orderInWorkout || index + 1,
          reps: ex.reps || 10,
          rounds: ex.sets || 1,
          weightDescription: ex.weightKg ? `${ex.weightKg}kg` : 'Bodyweight',
          notes: ex.notes || ''
        }))
      };
      
    case WORKOUT_TYPES.TABATA:
      return {
        totalRounds: 8,
        exercises: exercises.map((ex: any, index: number) => ({
          exerciseId: ex.exerciseId,
          name: ex.exercise?.name || 'Exercise',
          orderInWorkout: ex.orderInWorkout || index + 1,
          exercisePosition: index + 1,
          workTimeSeconds: 20,
          restTimeSeconds: 10,
          rounds: 8,
          weightDescription: ex.weightKg ? `${ex.weightKg}kg` : 'Bodyweight',
          notes: ex.notes || ''
        }))
      };
      
    case WORKOUT_TYPES.LADDER:
      return {
        ladderType: 'ascending',
        exercises: exercises.map((ex: any, index: number) => ({
          exerciseId: ex.exerciseId,
          name: ex.exercise?.name || 'Exercise',
          orderInWorkout: ex.orderInWorkout || index + 1,
          ladderPosition: index + 1,
          ladderType: 'ascending',
          startReps: 1,
          endReps: ex.reps || 10,
          increment: 1,
          weightDescription: ex.weightKg ? `${ex.weightKg}kg` : 'Bodyweight',
          notes: ex.notes || ''
        }))
      };
      
    default:
      return null;
  }
};

const WorkoutSession = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: workout, isLoading, error } = useWorkoutDetails(id!);
  
  // Session hooks
  const { state, startSession, pauseSession, resumeSession, endSession } = useWorkoutSession();
  const startSessionMutation = useStartSession();
  const completeSessionMutation = useCompleteSession();
  const pauseSessionMutation = usePauseSession();
  const resumeSessionMutation = useResumeSession();
  
  // Local state
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  
  const currentSession = state.currentSession;
  const isSessionActive = state.isSessionActive;
  const isPaused = currentSession?.sessionStatus === 'paused';
  const workoutTypeData = workout ? getWorkoutTypeData(workout) : null;

  // Initialize session when workout loads
  useEffect(() => {
    if (workout && !currentSession && !startSessionMutation.isPending) {
      const exercises = workout.workoutExercises || [];
      
      // Start session in context
      startSession(workout, exercises, workoutTypeData);
      
      // Create backend session
      const sessionRequest = {
        id: `session-${Date.now()}`, // Temporary ID, backend will assign real ID
        workoutId: workout.id,
        exerciseProgress: exercises.map(exercise => ({
          exerciseId: exercise.exerciseId,
          orderInWorkout: exercise.orderInWorkout,
          plannedSets: exercise.sets,
          plannedReps: exercise.reps,
          plannedWeightKg: exercise.weightKg,
          plannedDistanceMeters: exercise.distanceMeters,
          plannedDurationSeconds: exercise.durationSeconds,
          plannedRestSeconds: exercise.restSeconds
        }))
      };
      
      startSessionMutation.mutate(sessionRequest);
    }
  }, [workout, currentSession, startSession, workoutTypeData, startSessionMutation]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive && !isPaused) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading workout session...</p>
        </div>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto text-4xl text-white mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Workout Not Found</h2>
          <p className="text-white text-opacity-90 mb-6">The workout you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/workouts')}
            className="px-6 py-3 bg-white text-red-500 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Back to Workouts
          </button>
        </div>
      </div>
    );
  }

  const handlePauseResume = () => {
    if (currentSession) {
      if (isPaused) {
        resumeSessionMutation.mutate(currentSession.id);
        resumeSession();
      } else {
        pauseSessionMutation.mutate(currentSession.id);
        pauseSession();
      }
    }
  };

  const handleComplete = (result: any) => {
    if (currentSession) {
      const workoutResult = {
        sessionId: currentSession.id,
        workoutResult: {
          result: JSON.stringify(result),
          duration: sessionTime,
          completionTimeSeconds: sessionTime,
          workoutRating: 5,
          notes: `${result.type || 'Workout'} completed via session interface`
        }
      };
      
      completeSessionMutation.mutate(workoutResult, {
        onSuccess: () => {
          // End the session in context
          endSession({
            sessionId: currentSession.id,
            workoutId: currentSession.workoutId,
            totalTime: sessionTime,
            exercisesCompleted: result.exercisesCompleted || 0,
            exercisesSkipped: 0,
            totalSets: result.totalSets || 0,
            personalRecords: [],
            rating: 5,
            mood: 'good',
            energyLevel: 'high',
            notes: `${result.type || 'Workout'} completed successfully`,
            isPublic: false,
            achievements: [],
            workoutTypeResult: result
          });
          setShowEndDialog(true);
        },
        onError: (error) => {
          console.error('Failed to complete session:', error);
          // Still show completion dialog on error - user completed the workout
          setShowEndDialog(true);
        }
      });
    }
  };

  const handleSkip = () => {
    // Skip logic handled by individual workout type components
  };

  const handleEndSession = () => {
    if (currentSession) {
      endSession({
        sessionId: currentSession.id,
        workoutId: currentSession.workoutId,
        totalTime: sessionTime,
        exercisesCompleted: 0,
        exercisesSkipped: 0,
        totalSets: 0,
        personalRecords: [],
        rating: 3,
        mood: 'okay',
        energyLevel: 'medium',
        notes: 'Session ended early',
        isPublic: false,
        achievements: []
      });
    }
    navigate('/workouts');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Show error state
  if (error || !workout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto text-4xl text-white mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Workout Not Found</h2>
          <p className="text-white text-opacity-90 mb-6">The workout you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/workouts')}
            className="px-6 py-3 bg-white text-red-500 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Back to Workouts
          </button>
        </div>
      </div>
    );
  }

  // Show starting state
  if (!currentSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
        <div className="text-center">
          <FaClock className="mx-auto text-4xl text-white mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Starting Session</h2>
          <p className="text-white text-opacity-90">Preparing your workout session...</p>
        </div>
      </div>
    );
  }

  // Render workout-type-specific interface
  const renderWorkoutTypeInterface = () => {
    const workoutTypeId = workout.workoutTypeId || workout.workoutType?.id;
    
    console.log('Rendering workout type interface:', { 
      workoutTypeId, 
      workoutTypeData, 
      workout,
      hasStructure: !!workout.workoutStructure
    });
    
    if (!workoutTypeId) {
      // Fallback to generic interface
      return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
          <div className="text-center">
            <FaExclamationTriangle className="mx-auto text-4xl text-white mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Workout Type Not Supported</h2>
            <p className="text-white text-opacity-90 mb-6">This workout type doesn't have a specific session interface yet.</p>
            <button
              onClick={() => navigate('/workouts')}
              className="px-6 py-3 bg-white text-orange-500 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Back to Workouts
            </button>
          </div>
        </div>
      );
    }

    // Handle legacy workouts that don't have workoutStructure
    if (!workoutTypeData && workoutTypeId) {
      const fallbackData = createFallbackWorkoutData(workout);
      
      const commonProps = {
        workout,
        onComplete: handleComplete,
        onPause: handlePauseResume,
        onResume: handlePauseResume,
        onSkip: handleSkip,
        isPaused,
        sessionTime
      };

      switch (workoutTypeId) {
        case WORKOUT_TYPES.EMOM:
          return <EMOMSessionInterface {...commonProps} workoutData={fallbackData} />;
        case WORKOUT_TYPES.AMRAP:
          return <AMRAPSessionInterface {...commonProps} workoutData={fallbackData} />;
        case WORKOUT_TYPES.FOR_TIME:
          return <ForTimeSessionInterface {...commonProps} workoutData={fallbackData} />;
        case WORKOUT_TYPES.TABATA:
          return <TabataSessionInterface {...commonProps} workoutData={fallbackData} />;
        case WORKOUT_TYPES.LADDER:
          return <LadderSessionInterface {...commonProps} workoutData={fallbackData} />;
        default:
          return (
            <div className="min-h-screen bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
              <div className="text-center">
                <FaExclamationTriangle className="mx-auto text-4xl text-white mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Unknown Workout Type</h2>
                <p className="text-white text-opacity-90 mb-6">This workout type is not recognized.</p>
                <button
                  onClick={() => navigate('/workouts')}
                  className="px-6 py-3 bg-white text-gray-500 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  Back to Workouts
                </button>
              </div>
            </div>
          );
      }
    }

    const commonProps = {
      workout,
      onComplete: handleComplete,
      onPause: handlePauseResume,
      onResume: handlePauseResume,
      onSkip: handleSkip,
      isPaused,
      sessionTime
    };

    switch (workoutTypeId) {
      case WORKOUT_TYPES.EMOM:
        return <EMOMSessionInterface {...commonProps} workoutData={workoutTypeData} />;
      case WORKOUT_TYPES.AMRAP:
        return <AMRAPSessionInterface {...commonProps} workoutData={workoutTypeData} />;
      case WORKOUT_TYPES.FOR_TIME:
        return <ForTimeSessionInterface {...commonProps} workoutData={workoutTypeData} />;
      case WORKOUT_TYPES.TABATA:
        return <TabataSessionInterface {...commonProps} workoutData={workoutTypeData} />;
      case WORKOUT_TYPES.LADDER:
        return <LadderSessionInterface {...commonProps} workoutData={workoutTypeData} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
            <div className="text-center">
              <FaExclamationTriangle className="mx-auto text-4xl text-white mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Unknown Workout Type</h2>
              <p className="text-white text-opacity-90 mb-6">This workout type is not recognized.</p>
              <button
                onClick={() => navigate('/workouts')}
                className="px-6 py-3 bg-white text-gray-500 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                Back to Workouts
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {renderWorkoutTypeInterface()}
      
      {/* End Session Dialog */}
      <AnimatePresence>
        {showEndDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEndDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <FaCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Workout Complete!</h3>
                <p className="text-gray-600 mb-8">
                  Amazing work! You've completed your workout session. 
                  Your progress has been saved.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setShowEndDialog(false);
                      navigate('/workouts');
                    }}
                    className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    View Workouts
                  </button>
                  <button
                    onClick={() => {
                      handleEndSession();
                    }}
                    className="flex-1 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                  >
                    Finish & View Results
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WorkoutSession;