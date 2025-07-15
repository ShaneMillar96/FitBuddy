import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, 
  FaPause, 
  FaStepForward, 
  FaFlag, 
  FaClock,
  FaCheckCircle,
  FaBolt,
  FaFastForward
} from 'react-icons/fa';
import { ForTimeWorkoutData } from '@/interfaces/workout-types';
import { Workout } from '@/interfaces/workout';

interface ForTimeSessionInterfaceProps {
  workout: Workout;
  workoutData: ForTimeWorkoutData;
  onComplete: (result: any) => void;
  onPause: () => void;
  onResume: () => void;
  onSkip: () => void;
  isPaused: boolean;
  sessionTime: number;
}

const ForTimeSessionInterface: React.FC<ForTimeSessionInterfaceProps> = ({
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
  const [exercisesCompleted, setExercisesCompleted] = useState(0);
  const [showRoundComplete, setShowRoundComplete] = useState(false);
  const [exerciseStartTimes, setExerciseStartTimes] = useState<number[]>([]);
  const [exerciseCompleteTimes, setExerciseCompleteTimes] = useState<number[]>([]);

  const totalRounds = workoutData.totalRounds || 1;
  const totalExercises = workoutData.exercises.length * totalRounds;
  const currentExercise = workoutData.exercises[currentExerciseIndex];
  const progressPercentage = (exercisesCompleted / totalExercises) * 100;

  // Track exercise start time
  useEffect(() => {
    if (exerciseStartTimes.length === exercisesCompleted) {
      setExerciseStartTimes(prev => [...prev, sessionTime]);
    }
  }, [exercisesCompleted, sessionTime, exerciseStartTimes.length]);

  const handleNext = () => {
    // Record completion time
    setExerciseCompleteTimes(prev => [...prev, sessionTime]);
    setExercisesCompleted(prev => prev + 1);
    
    if (currentExerciseIndex < workoutData.exercises.length - 1) {
      // Move to next exercise in round
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      // Complete round
      if (currentRound < totalRounds) {
        setCurrentExerciseIndex(0);
        setCurrentRound(prev => prev + 1);
        setShowRoundComplete(true);
        setTimeout(() => setShowRoundComplete(false), 2000);
      } else {
        // Workout complete
        onComplete({
          type: 'FOR_TIME',
          roundsCompleted: totalRounds,
          exercisesCompleted: exercisesCompleted + 1,
          totalTime: sessionTime,
          exerciseSplits: calculateExerciseSplits(),
          averageRoundTime: sessionTime / totalRounds
        });
      }
    }
  };

  const handleFinish = () => {
    onComplete({
      type: 'FOR_TIME',
      roundsCompleted: currentRound,
      exercisesCompleted,
      totalTime: sessionTime,
      exerciseSplits: calculateExerciseSplits(),
      averageRoundTime: sessionTime / currentRound
    });
  };

  const calculateExerciseSplits = () => {
    return exerciseStartTimes.map((startTime, index) => {
      const endTime = exerciseCompleteTimes[index];
      return endTime ? endTime - startTime : sessionTime - startTime;
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
    if (currentRound < totalRounds) {
      return workoutData.exercises[0]; // First exercise of next round
    }
    return null;
  };

  const getRoundProgress = () => {
    return `${currentExerciseIndex + 1}/${workoutData.exercises.length}`;
  };

  const calculateTotalVolume = () => {
    return workoutData.exercises.reduce((sum, exercise) => {
      return sum + (exercise.reps * totalRounds);
    }, 0);
  };

  const getCurrentExerciseTime = () => {
    const currentStartTime = exerciseStartTimes[exercisesCompleted];
    return currentStartTime ? sessionTime - currentStartTime : 0;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with yellow gradient for For Time */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-2xl">
                ⚡
              </div>
              <div>
                <h1 className="text-2xl font-bold">For Time Session</h1>
                <p className="text-white text-opacity-90">
                  {totalRounds} Round{totalRounds > 1 ? 's' : ''} • Complete as fast as possible
                </p>
              </div>
            </div>
            
            {/* Stopwatch Timer */}
            <div className="relative">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mx-auto mb-1"></div>
                  <div className="text-black text-lg font-bold">{formatTime(sessionTime)}</div>
                </div>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center">
                <div className="text-sm text-white opacity-90">
                  {isPaused ? 'Paused' : 'Elapsed Time'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-white text-opacity-90 mb-2">
              <span>Round {currentRound} of {totalRounds} • Exercise {getRoundProgress()}</span>
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
              key={`${currentExercise?.exerciseId}-${currentRound}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  {currentExercise?.name || 'Exercise'}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    Round {currentRound}/{totalRounds}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {getRoundProgress()}
                  </span>
                </div>
              </div>

              {/* Exercise Parameters */}
              <div className="grid grid-cols-3 gap-6 mb-8">
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
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {formatTime(getCurrentExerciseTime())}
                  </div>
                  <div className="text-gray-600 font-medium">Exercise Time</div>
                </div>
              </div>

              {/* Next Exercise Preview */}
              {getNextExercise() && (
                <div className="bg-yellow-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-yellow-900 mb-1">Next Exercise</h3>
                      <p className="text-yellow-800">
                        {getNextExercise()?.name} - {getNextExercise()?.reps} reps
                      </p>
                    </div>
                    <FaFastForward className="text-yellow-600" />
                  </div>
                </div>
              )}

              {/* Workout Complete Preview */}
              {!getNextExercise() && (
                <div className="bg-green-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-green-900 mb-1">Final Exercise</h3>
                      <p className="text-green-800">
                        Complete this exercise to finish the workout!
                      </p>
                    </div>
                    <FaFlag className="text-green-600" />
                  </div>
                </div>
              )}

              {/* Notes */}
              {currentExercise?.notes && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Notes</h3>
                  <p className="text-blue-800">{currentExercise.notes}</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Exercise Sequence */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Exercise Sequence</h3>
              <div className="space-y-2">
                {workoutData.exercises.map((exercise, index) => (
                  <div
                    key={exercise.exerciseId}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      index === currentExerciseIndex
                        ? 'bg-yellow-100 border-2 border-yellow-300'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === currentExerciseIndex
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-gray-800">{exercise.name}</div>
                      <div className="text-sm text-gray-600">
                        {exercise.reps} reps × {totalRounds} rounds = {exercise.reps * totalRounds} total
                      </div>
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
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {isPaused ? <FaPlay /> : <FaPause />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>
                
                <button
                  onClick={handleNext}
                  className="w-full px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <FaStepForward />
                  <span>Complete Exercise</span>
                </button>
                
                <button
                  onClick={handleFinish}
                  className="w-full px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2 font-medium"
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
                  <span className="text-xl font-bold text-gray-900">{currentRound - 1 + (currentExerciseIndex / workoutData.exercises.length)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Exercises Completed</span>
                  <span className="text-xl font-bold text-gray-900">{exercisesCompleted}/{totalExercises}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total Volume</span>
                  <span className="text-xl font-bold text-gray-900">{calculateTotalVolume()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Average Pace</span>
                  <span className="text-xl font-bold text-gray-900">
                    {exercisesCompleted > 0 ? formatTime(Math.round(sessionTime / exercisesCompleted)) : '0:00'}/ex
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
                Round {currentRound - 1} finished • Starting Round {currentRound}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ForTimeSessionInterface;