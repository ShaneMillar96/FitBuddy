import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, 
  FaPause, 
  FaStepForward, 
  FaFlag, 
  FaClock,
  FaCheckCircle,
  FaArrowRight
} from 'react-icons/fa';
import { EMOMWorkoutData } from '@/interfaces/workout-types';
import { Workout } from '@/interfaces/workout';

interface EMOMSessionInterfaceProps {
  workout: Workout;
  workoutData: EMOMWorkoutData;
  onComplete: (result: any) => void;
  onPause: () => void;
  onResume: () => void;
  onSkip: () => void;
  isPaused: boolean;
  sessionTime: number;
}

const EMOMSessionInterface: React.FC<EMOMSessionInterfaceProps> = ({
  workout,
  workoutData,
  onComplete,
  onPause,
  onResume,
  onSkip,
  isPaused,
  sessionTime
}) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [currentMinute, setCurrentMinute] = useState(1);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [exercisesCompleted, setExercisesCompleted] = useState(0);
  const [showRoundComplete, setShowRoundComplete] = useState(false);

  const totalMinutes = workoutData.totalMinutes;
  const exercisesPerRound = workoutData.exercisesPerRound;
  const currentExercise = workoutData.exercises[currentExerciseIndex];
  const progressPercentage = (currentMinute / totalMinutes) * 100;

  // Auto-advance minute timer
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const currentMinuteInSession = Math.floor(sessionTime / 60) + 1;
      
      if (currentMinuteInSession > currentMinute && currentMinuteInSession <= totalMinutes) {
        setCurrentMinute(currentMinuteInSession);
        
        // Check if we've completed a round
        if (currentMinuteInSession % exercisesPerRound === 1 && currentMinuteInSession > 1) {
          setCurrentRound(prev => prev + 1);
          setRoundsCompleted(prev => prev + 1);
          setShowRoundComplete(true);
          setTimeout(() => setShowRoundComplete(false), 2000);
        }
        
        // Update current exercise index within the round
        const exerciseInRound = ((currentMinuteInSession - 1) % exercisesPerRound);
        setCurrentExerciseIndex(exerciseInRound);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionTime, isPaused, currentMinute, exercisesPerRound, totalMinutes]);

  const handleNext = () => {
    setExercisesCompleted(prev => prev + 1);
    
    if (currentMinute >= totalMinutes) {
      // Workout complete
      onComplete({
        type: 'EMOM',
        roundsCompleted: workoutData.roundCount,
        exercisesCompleted: exercisesCompleted + 1,
        totalMinutes: totalMinutes,
        completionTime: sessionTime
      });
    } else {
      // Move to next minute/exercise
      const nextMinute = currentMinute + 1;
      setCurrentMinute(nextMinute);
      
      if (nextMinute % exercisesPerRound === 1 && nextMinute > 1) {
        setCurrentRound(prev => prev + 1);
        setRoundsCompleted(prev => prev + 1);
        setShowRoundComplete(true);
        setTimeout(() => setShowRoundComplete(false), 2000);
      }
      
      const nextExerciseIndex = ((nextMinute - 1) % exercisesPerRound);
      setCurrentExerciseIndex(nextExerciseIndex);
    }
  };

  const handleFinish = () => {
    onComplete({
      type: 'EMOM',
      roundsCompleted: Math.floor((currentMinute - 1) / exercisesPerRound) + 1,
      exercisesCompleted,
      totalMinutes: currentMinute,
      completionTime: sessionTime
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getNextExercise = () => {
    if (currentExerciseIndex < exercisesPerRound - 1) {
      return workoutData.exercises[currentExerciseIndex + 1];
    }
    return workoutData.exercises[0]; // Next round, first exercise
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with blue gradient for EMOM */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-2xl">
                ⏰
              </div>
              <div>
                <h1 className="text-2xl font-bold">EMOM Session</h1>
                <p className="text-white text-opacity-90">
                  Round {currentRound} of {workoutData.roundCount}
                </p>
              </div>
            </div>
            
            {/* Timer */}
            <div className="relative">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mb-1"></div>
                  <div className="text-black text-lg font-bold">{formatTime(sessionTime)}</div>
                </div>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center">
                <div className="text-sm text-white opacity-90">
                  {isPaused ? 'Paused' : 'Active'} • Total Timer
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-white text-opacity-90 mb-2">
              <span>Minute {currentMinute} of {totalMinutes}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
              <motion.div
                className="bg-white rounded-full h-3"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Exercise Card */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentExercise?.exerciseId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  {currentExercise?.name || 'Exercise'}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Minute {currentMinute}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Position {currentExercise?.roundPosition}
                  </span>
                </div>
              </div>

              {/* Exercise Parameters */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {currentExercise?.reps || 0}
                  </div>
                  <div className="text-gray-600 font-medium">Reps</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {currentExercise?.weightDescription || 'Bodyweight'}
                  </div>
                  <div className="text-gray-600 font-medium">Weight</div>
                </div>
              </div>

              {/* Next Exercise Preview */}
              {currentMinute < totalMinutes && (
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">Next Minute</h3>
                      <p className="text-blue-800">
                        {getNextExercise()?.name} - {getNextExercise()?.reps} reps
                      </p>
                    </div>
                    <FaArrowRight className="text-blue-600" />
                  </div>
                </div>
              )}

              {/* Notes */}
              {currentExercise?.notes && (
                <div className="mt-6 bg-yellow-50 rounded-xl p-4">
                  <h3 className="font-semibold text-yellow-900 mb-2">Notes</h3>
                  <p className="text-yellow-800">{currentExercise.notes}</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Round Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Round Timeline</h3>
              <div className="space-y-2">
                {workoutData.exercises.map((exercise, index) => (
                  <div
                    key={exercise.exerciseId}
                    className={`flex items-center p-3 rounded-lg ${
                      index === currentExerciseIndex
                        ? 'bg-blue-100 border-2 border-blue-300'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === currentExerciseIndex
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-gray-800">{exercise.name}</div>
                      <div className="text-sm text-gray-600">{exercise.reps} reps</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Session Controls */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Session Controls</h3>
              <div className="space-y-3">
                <button
                  onClick={isPaused ? onResume : onPause}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                    isPaused
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-yellow-500 text-white hover:bg-yellow-600'
                  }`}
                >
                  {isPaused ? <FaPlay /> : <FaPause />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>
                
                <button
                  onClick={handleNext}
                  className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <FaStepForward />
                  <span>Complete Exercise</span>
                </button>
                
                <button
                  onClick={handleFinish}
                  className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <FaFlag />
                  <span>Finish Workout</span>
                </button>
              </div>
            </div>

            {/* Session Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Session Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Rounds Completed</span>
                  <span className="text-xl font-bold text-gray-900">{roundsCompleted}/{workoutData.roundCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Exercises Completed</span>
                  <span className="text-xl font-bold text-gray-900">{exercisesCompleted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Current Minute</span>
                  <span className="text-xl font-bold text-gray-900">{currentMinute}/{totalMinutes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Round Complete Animation */}
      <AnimatePresence>
        {showRoundComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          >
            <div className="bg-white rounded-2xl p-8 text-center">
              <FaCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Round Complete!</h3>
              <p className="text-gray-600">
                Starting Round {currentRound} of {workoutData.roundCount}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EMOMSessionInterface;