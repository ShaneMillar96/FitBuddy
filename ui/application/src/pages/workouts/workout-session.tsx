import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, 
  FaPause, 
  FaStop, 
  FaArrowLeft, 
  FaArrowRight,
  FaStepForward,
  FaFlag,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaDumbbell
} from 'react-icons/fa';

import { useWorkoutSession } from '@/contexts/WorkoutSessionContext';
import { useWorkoutDetails } from '@/hooks/useWorkoutDetails';
import WorkoutTimer from '@/components/workout/WorkoutTimer';
import { CATEGORY_ICONS, WORKOUT_CATEGORIES } from '@/interfaces/categories';

// Mock data for workout exercises - in real app, this would come from an API
const mockWorkoutExercises = [
  {
    id: 1,
    exerciseId: 1,
    workoutId: 1,
    orderInWorkout: 1,
    sets: 3,
    reps: 10,
    weightKg: 100,
    restSeconds: 60,
    notes: "Focus on form",
    exercise: {
      id: 1,
      name: "Barbell Back Squat",
      categoryId: 1,
      categoryName: "Weight Session",
      muscleGroups: ["Quadriceps", "Glutes", "Hamstrings"],
      equipmentNeeded: ["Barbell", "Squat Rack"],
      description: "Compound lower body exercise",
      instructions: "1. Position bar on upper back\n2. Squat down until thighs parallel\n3. Drive through heels to stand",
      difficultyLevel: 3,
      isCompound: true,
      exerciseType: "strength"
    }
  },
  {
    id: 2,
    exerciseId: 2,
    workoutId: 1,
    orderInWorkout: 2,
    sets: 3,
    reps: 12,
    weightKg: 80,
    restSeconds: 45,
    notes: "",
    exercise: {
      id: 2,
      name: "Romanian Deadlift",
      categoryId: 1,
      categoryName: "Weight Session",
      muscleGroups: ["Hamstrings", "Glutes", "Lower Back"],
      equipmentNeeded: ["Barbell"],
      description: "Hip hinge movement pattern",
      instructions: "1. Hold bar with overhand grip\n2. Hinge at hips, lower bar\n3. Drive hips forward to return",
      difficultyLevel: 3,
      isCompound: true,
      exerciseType: "strength"
    }
  },
  {
    id: 3,
    exerciseId: 3,
    workoutId: 1,
    orderInWorkout: 3,
    sets: 2,
    reps: 15,
    weightKg: 60,
    restSeconds: 30,
    notes: "Light weight, focus on squeeze",
    exercise: {
      id: 3,
      name: "Bulgarian Split Squat",
      categoryId: 1,
      categoryName: "Weight Session",
      muscleGroups: ["Quadriceps", "Glutes"],
      equipmentNeeded: ["Dumbbells", "Bench"],
      description: "Single leg exercise",
      instructions: "1. Rear foot elevated on bench\n2. Lower into lunge position\n3. Push through front heel",
      difficultyLevel: 2,
      isCompound: true,
      exerciseType: "strength"
    }
  }
];

const WorkoutSession = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: workout, isLoading, error } = useWorkoutDetails(id!);
  
  const {
    state,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    abandonSession,
    startExercise,
    completeExercise,
    skipExercise,
    startSet,
    completeSet
  } = useWorkoutSession();

  const [showAbandonDialog, setShowAbandonDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [currentSetData, setCurrentSetData] = useState<{
    reps?: number;
    weight?: number;
    duration?: number;
    rpe?: number;
  }>({});

  const currentExercise = state.currentSession?.exerciseProgress[state.currentSession.currentExerciseIndex];
  const currentSet = currentExercise?.sets.find(set => set.status === 'in_progress') || 
                    currentExercise?.sets.find(set => set.status === 'not_started');

  // Start session when component mounts if not already started
  useEffect(() => {
    if (workout && !state.currentSession && !isLoading) {
      startSession(workout, mockWorkoutExercises);
    }
  }, [workout, state.currentSession, isLoading, startSession]);

  // Auto-start first exercise when session starts
  useEffect(() => {
    if (state.currentSession && 
        state.currentSession.sessionStatus === 'active' && 
        state.currentSession.currentExerciseIndex === 0 &&
        currentExercise?.status === 'not_started') {
      startExercise(0);
    }
  }, [state.currentSession, currentExercise, startExercise]);

  // Handle browser back/refresh attempts
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.isSessionActive) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (state.isSessionActive) {
        e.preventDefault();
        setShowAbandonDialog(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [state.isSessionActive]);

  const handleStartSet = () => {
    if (currentExercise && currentSet) {
      const exerciseIndex = state.currentSession!.currentExerciseIndex;
      startSet(exerciseIndex, currentSet.setNumber);
    }
  };

  const handleCompleteSet = () => {
    if (currentExercise && currentSet) {
      const exerciseIndex = state.currentSession!.currentExerciseIndex;
      completeSet(exerciseIndex, currentSet.setNumber, {
        actualReps: currentSetData.reps,
        actualWeightKg: currentSetData.weight,
        actualDurationSeconds: currentSetData.duration,
        rpe: currentSetData.rpe
      });
      setCurrentSetData({});
    }
  };

  const handleNextExercise = () => {
    if (currentExercise) {
      const exerciseIndex = state.currentSession!.currentExerciseIndex;
      completeExercise(exerciseIndex);
      
      // Move to next exercise if available
      if (exerciseIndex < state.currentSession!.exerciseProgress.length - 1) {
        startExercise(exerciseIndex + 1);
      } else {
        // All exercises completed
        setShowCompleteDialog(true);
      }
    }
  };

  const handleSkipExercise = () => {
    if (currentExercise) {
      const exerciseIndex = state.currentSession!.currentExerciseIndex;
      skipExercise(exerciseIndex);
      
      // Move to next exercise if available
      if (exerciseIndex < state.currentSession!.exerciseProgress.length - 1) {
        startExercise(exerciseIndex + 1);
      } else {
        setShowCompleteDialog(true);
      }
    }
  };

  const handleAbandonWorkout = () => {
    abandonSession();
    navigate('/workouts');
  };

  const handleCompleteWorkout = () => {
    // TODO: Navigate to results entry form
    endSession({});
    navigate('/workouts');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto text-4xl text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">Workout Not Found</h2>
          <p className="text-red-600 mb-6">The workout you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/workouts')}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Back to Workouts
          </button>
        </div>
      </div>
    );
  }

  if (!state.currentSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-blue-600">Starting workout session...</p>
        </div>
      </div>
    );
  }

  const getCategoryGradient = (categoryId?: number): string => {
    if (!categoryId) return 'from-gray-400 to-gray-500';
    const gradients = {
      [WORKOUT_CATEGORIES.WEIGHT_SESSION]: 'from-blue-500 to-purple-600',
      [WORKOUT_CATEGORIES.CROSSFIT_WOD]: 'from-red-500 to-orange-500',
      [WORKOUT_CATEGORIES.RUNNING_INTERVALS]: 'from-green-500 to-teal-500',
      [WORKOUT_CATEGORIES.SWIMMING]: 'from-cyan-500 to-blue-500',
      [WORKOUT_CATEGORIES.HYROX]: 'from-yellow-500 to-orange-500',
      [WORKOUT_CATEGORIES.STRETCHING]: 'from-purple-500 to-pink-500'
    };
    return gradients[categoryId as keyof typeof gradients] || 'from-gray-400 to-gray-500';
  };

  const completedExercises = state.currentSession.exerciseProgress.filter(ex => 
    ex.status === 'completed' || ex.status === 'skipped').length;
  const totalExercises = state.currentSession.exerciseProgress.length;
  const progressPercentage = (completedExercises / totalExercises) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getCategoryGradient(workout.categoryId)} text-white py-6 px-4`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {workout.categoryId && (
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-2xl">
                  {CATEGORY_ICONS[workout.categoryId as keyof typeof CATEGORY_ICONS]}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">{workout.name}</h1>
                <p className="text-white text-opacity-90">Active Workout Session</p>
              </div>
            </div>
            
            {/* Session Timer */}
            <WorkoutTimer
              type="total"
              mode="stopwatch"
              isRunning={state.timer.isRunning}
              isPaused={state.timer.isPaused}
              currentTime={state.timer.currentTime}
              onPlay={() => state.timer.isPaused ? resumeSession() : {}}
              onPause={pauseSession}
              onStop={() => setShowAbandonDialog(true)}
              showControls={false}
              size="sm"
            />
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-white text-opacity-90 mb-2">
              <span>Exercise {state.currentSession.currentExerciseIndex + 1} of {totalExercises}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <motion.div
                className="bg-white rounded-full h-2"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Exercise Details */}
          <div className="lg:col-span-2 space-y-6">
            {currentExercise && (
              <motion.div
                key={currentExercise.exerciseId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentExercise.exercise.name}
                  </h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {currentExercise.exercise.exerciseType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {currentExercise.plannedSets}
                    </div>
                    <div className="text-sm text-gray-600">Sets</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {currentExercise.plannedReps}
                    </div>
                    <div className="text-sm text-gray-600">Reps</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {currentExercise.plannedWeightKg}kg
                    </div>
                    <div className="text-sm text-gray-600">Weight</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {currentExercise.plannedRestSeconds}s
                    </div>
                    <div className="text-sm text-gray-600">Rest</div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2">Instructions</h3>
                  <p className="text-blue-800 text-sm whitespace-pre-line">
                    {currentExercise.exercise.instructions}
                  </p>
                </div>

                {/* Current Set */}
                {currentSet && (
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">
                        Set {currentSet.setNumber} of {currentExercise.plannedSets}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        currentSet.status === 'in_progress' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {currentSet.status.replace('_', ' ')}
                      </span>
                    </div>

                    {currentSet.status === 'not_started' && (
                      <button
                        onClick={handleStartSet}
                        className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <FaPlay />
                        <span>Start Set</span>
                      </button>
                    )}

                    {currentSet.status === 'in_progress' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Reps Completed
                            </label>
                            <input
                              type="number"
                              value={currentSetData.reps || ''}
                              onChange={(e) => setCurrentSetData(prev => ({ 
                                ...prev, 
                                reps: parseInt(e.target.value) || undefined 
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder={currentExercise.plannedReps?.toString()}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Weight (kg)
                            </label>
                            <input
                              type="number"
                              step="0.5"
                              value={currentSetData.weight || ''}
                              onChange={(e) => setCurrentSetData(prev => ({ 
                                ...prev, 
                                weight: parseFloat(e.target.value) || undefined 
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder={currentExercise.plannedWeightKg?.toString()}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            RPE (1-10)
                          </label>
                          <select
                            value={currentSetData.rpe || ''}
                            onChange={(e) => setCurrentSetData(prev => ({ 
                              ...prev, 
                              rpe: parseInt(e.target.value) || undefined 
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select RPE</option>
                            {[...Array(10)].map((_, i) => (
                              <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                          </select>
                        </div>

                        <button
                          onClick={handleCompleteSet}
                          disabled={!currentSetData.reps}
                          className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          <FaCheckCircle />
                          <span>Complete Set</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Exercise Navigation */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Exercise Navigation</h3>
              <div className="flex justify-center space-x-3 mb-4">
                <button
                  onClick={handleSkipExercise}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
                >
                  <FaStepForward />
                  <span>Skip</span>
                </button>
                <button
                  onClick={handleNextExercise}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                >
                  <FaArrowRight />
                  <span>Next</span>
                </button>
              </div>
              
              <button
                onClick={() => setShowCompleteDialog(true)}
                className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
              >
                <FaFlag />
                <span>Finish Workout</span>
              </button>
            </div>

            {/* Session Controls */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Session Controls</h3>
              <div className="space-y-3">
                <button
                  onClick={state.timer.isRunning ? pauseSession : resumeSession}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                    state.timer.isRunning 
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {state.timer.isRunning ? <FaPause /> : <FaPlay />}
                  <span>{state.timer.isRunning ? 'Pause' : 'Resume'}</span>
                </button>
                
                <button
                  onClick={() => setShowAbandonDialog(true)}
                  className="w-full py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <FaStop />
                  <span>End Session</span>
                </button>
              </div>
            </div>

            {/* Stats */}
            {state.stats && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Session Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Exercises Completed</span>
                    <span className="font-semibold">{state.stats.completedExercises}/{state.stats.totalExercises}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sets Completed</span>
                    <span className="font-semibold">{state.stats.completedSets}/{state.stats.totalSets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Volume</span>
                    <span className="font-semibold">{Math.round(state.stats.totalVolume)}kg</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Abandon Dialog */}
      <AnimatePresence>
        {showAbandonDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAbandonDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <FaExclamationTriangle className="mx-auto text-4xl text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">End Workout?</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to end this workout session? Your progress will be saved.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAbandonDialog(false)}
                    className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAbandonWorkout}
                    className="flex-1 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    End Session
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complete Dialog */}
      <AnimatePresence>
        {showCompleteDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCompleteDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <FaCheckCircle className="mx-auto text-4xl text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Workout Complete!</h3>
                <p className="text-gray-600 mb-6">
                  Congratulations! You've completed your workout. Record your results to track your progress.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowCompleteDialog(false)}
                    className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCompleteWorkout}
                    className="flex-1 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                  >
                    Record Results
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkoutSession;