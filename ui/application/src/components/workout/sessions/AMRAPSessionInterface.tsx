import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, 
  FaPause, 
  FaStepForward, 
  FaFlag, 
  FaClock,
  FaCheckCircle,
  FaPlus,
  FaFire
} from 'react-icons/fa';
import { AMRAPWorkoutData } from '@/interfaces/workout-types';
import { Workout } from '@/interfaces/workout';

interface AMRAPSessionInterfaceProps {
  workout: Workout;
  workoutData: AMRAPWorkoutData;
  onComplete: (result: any) => void;
  onPause: () => void;
  onResume: () => void;
  onSkip: () => void;
  isPaused: boolean;
  sessionTime: number;
}

const AMRAPSessionInterface: React.FC<AMRAPSessionInterfaceProps> = ({
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
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [exercisesCompleted, setExercisesCompleted] = useState(0);
  const [showRoundComplete, setShowRoundComplete] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const timeCapSeconds = workoutData.timeCapMinutes * 60;
  const timeRemaining = Math.max(0, timeCapSeconds - sessionTime);
  const currentExercise = workoutData.exercises[currentExerciseIndex];
  const progressPercentage = (sessionTime / timeCapSeconds) * 100;

  // Check if time is up
  useEffect(() => {
    if (timeRemaining <= 0 && !isTimeUp) {
      setIsTimeUp(true);
      onComplete({
        type: 'AMRAP',
        roundsCompleted,
        partialRound: currentExerciseIndex > 0 ? currentExerciseIndex : 0,
        exercisesCompleted,
        timeCapMinutes: workoutData.timeCapMinutes,
        completionTime: sessionTime
      });
    }
  }, [timeRemaining, isTimeUp, roundsCompleted, currentExerciseIndex, exercisesCompleted, workoutData.timeCapMinutes, sessionTime, onComplete]);

  const handleNext = () => {
    setExercisesCompleted(prev => prev + 1);
    
    if (currentExerciseIndex < workoutData.exercises.length - 1) {
      // Move to next exercise in round
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      // Complete round, start new round
      setCurrentExerciseIndex(0);
      setRoundsCompleted(prev => prev + 1);
      setCurrentRound(prev => prev + 1);
      setShowRoundComplete(true);
      setTimeout(() => setShowRoundComplete(false), 2000);
    }
  };

  const handleFinish = () => {
    onComplete({
      type: 'AMRAP',
      roundsCompleted,
      partialRound: currentExerciseIndex,
      exercisesCompleted,
      timeCapMinutes: workoutData.timeCapMinutes,
      completionTime: sessionTime
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getNextExercise = () => {
    if (currentExerciseIndex < workoutData.exercises.length - 1) {
      return workoutData.exercises[currentExerciseIndex + 1];
    }
    return workoutData.exercises[0]; // Next round, first exercise
  };

  const getRoundProgress = () => {
    return `${currentExerciseIndex + 1}/${workoutData.exercises.length}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with orange gradient for AMRAP */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-2xl">
                🔄
              </div>
              <div>
                <h1 className="text-2xl font-bold">AMRAP Session</h1>
                <p className="text-white text-opacity-90">
                  {workoutData.timeCapMinutes} Minute Time Cap
                </p>
              </div>
            </div>
            
            {/* Countdown Timer */}
            <div className="relative">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${
                    timeRemaining <= 60 ? 'bg-red-500' : 'bg-orange-500'
                  }`}></div>
                  <div className={`text-lg font-bold ${
                    timeRemaining <= 60 ? 'text-red-600' : 'text-black'
                  }`}>
                    {formatTime(timeRemaining)}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center">
                <div className="text-sm text-white opacity-90">
                  {isPaused ? 'Paused' : 'Time Remaining'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-white text-opacity-90 mb-2">
              <span>Round {currentRound} • Exercise {getRoundProgress()}</span>
              <span>{Math.round(progressPercentage)}% Time Used</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
              <motion.div
                className={`rounded-full h-3 ${
                  progressPercentage > 90 ? 'bg-red-400' : 'bg-white'
                }`}
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
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    Round {currentRound}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {getRoundProgress()}
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
              <div className="bg-orange-50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-orange-900 mb-1">Next Exercise</h3>
                    <p className="text-orange-800">
                      {getNextExercise()?.name} - {getNextExercise()?.reps} reps
                    </p>
                  </div>
                  <FaStepForward className="text-orange-600" />
                </div>
              </div>

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
            {/* Round Structure */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Round Structure</h3>
              <div className="space-y-2">
                {workoutData.exercises.map((exercise, index) => (
                  <div
                    key={exercise.exerciseId}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      index === currentExerciseIndex
                        ? 'bg-orange-100 border-2 border-orange-300'
                        : index < currentExerciseIndex
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === currentExerciseIndex
                        ? 'bg-orange-500 text-white'
                        : index < currentExerciseIndex
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {index < currentExerciseIndex ? '✓' : index + 1}
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
                  className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <FaStepForward />
                  <span>Complete Exercise</span>
                </button>
                
                <button
                  onClick={handleFinish}
                  className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <FaFlag />
                  <span>Finish Early</span>
                </button>
              </div>
            </div>

            {/* Session Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Session Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Rounds Completed</span>
                  <span className="text-xl font-bold text-orange-600">{roundsCompleted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Exercises Completed</span>
                  <span className="text-xl font-bold text-gray-900">{exercisesCompleted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Current Round</span>
                  <span className="text-xl font-bold text-gray-900">{getRoundProgress()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Time Remaining</span>
                  <span className={`text-xl font-bold ${
                    timeRemaining <= 60 ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {formatTime(timeRemaining)}
                  </span>
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
                Starting Round {currentRound} • Keep pushing!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time's Up Animation */}
      <AnimatePresence>
        {isTimeUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          >
            <div className="bg-white rounded-2xl p-8 text-center">
              <FaFire className="mx-auto text-5xl text-red-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Time's Up!</h3>
              <p className="text-gray-600">
                {roundsCompleted} rounds + {currentExerciseIndex} exercises completed
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AMRAPSessionInterface;