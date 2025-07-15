import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, 
  FaPause, 
  FaStepForward, 
  FaFlag, 
  FaClock,
  FaCheckCircle,
  FaFire,
  FaRedo
} from 'react-icons/fa';
import { TabataWorkoutData } from '@/interfaces/workout-types';
import { Workout } from '@/interfaces/workout';

interface TabataSessionInterfaceProps {
  workout: Workout;
  workoutData: TabataWorkoutData;
  onComplete: (result: any) => void;
  onPause: () => void;
  onResume: () => void;
  onSkip: () => void;
  isPaused: boolean;
  sessionTime: number;
}

const TabataSessionInterface: React.FC<TabataSessionInterfaceProps> = ({
  workout,
  workoutData,
  onComplete,
  onPause,
  onResume,
  onSkip,
  isPaused,
  sessionTime
}) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [phaseStartTime, setPhaseStartTime] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [showRoundComplete, setShowRoundComplete] = useState(false);
  const [showExerciseComplete, setShowExerciseComplete] = useState(false);

  const currentExercise = workoutData.exercises[currentExerciseIndex];
  const workTime = currentExercise?.workTimeSeconds || 20;
  const restTime = currentExercise?.restTimeSeconds || 10;
  const totalRounds = currentExercise?.rounds || 8;
  const totalExercises = workoutData.exercises.length;

  // Calculate phase time remaining
  const phaseElapsed = sessionTime - phaseStartTime;
  const phaseTimeLimit = isWorkPhase ? workTime : restTime;
  const phaseTimeRemaining = Math.max(0, phaseTimeLimit - phaseElapsed);
  const phaseProgress = (phaseElapsed / phaseTimeLimit) * 100;

  // Auto-advance phases
  useEffect(() => {
    if (isPaused) return;
    
    if (phaseTimeRemaining <= 0) {
      if (isWorkPhase) {
        // Work phase complete, start rest
        setIsWorkPhase(false);
        setPhaseStartTime(sessionTime);
        
        if (currentRound >= totalRounds) {
          // Exercise complete
          setShowRoundComplete(true);
          setTimeout(() => setShowRoundComplete(false), 2000);
          
          if (currentExerciseIndex < totalExercises - 1) {
            // Move to next exercise
            setCurrentExerciseIndex(prev => prev + 1);
            setCurrentRound(1);
            setIsWorkPhase(true);
            setPhaseStartTime(sessionTime);
          } else {
            // Workout complete
            onComplete({
              type: 'TABATA',
              exercisesCompleted: totalExercises,
              totalRounds: workoutData.totalRounds,
              workoutTime: sessionTime,
              intervalsCompleted: totalExercises * totalRounds
            });
          }
        }
      } else {
        // Rest phase complete, start next work phase
        setIsWorkPhase(true);
        setPhaseStartTime(sessionTime);
        setCurrentRound(prev => prev + 1);
      }
    }
  }, [phaseTimeRemaining, isWorkPhase, currentRound, totalRounds, currentExerciseIndex, totalExercises, sessionTime, isPaused, workoutData.totalRounds, onComplete]);

  const handleNext = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentRound(1);
      setIsWorkPhase(true);
      setPhaseStartTime(sessionTime);
      setShowExerciseComplete(true);
      setTimeout(() => setShowExerciseComplete(false), 2000);
    } else {
      onComplete({
        type: 'TABATA',
        exercisesCompleted: totalExercises,
        totalRounds: workoutData.totalRounds,
        workoutTime: sessionTime,
        intervalsCompleted: totalExercises * totalRounds
      });
    }
  };

  const handleFinish = () => {
    onComplete({
      type: 'TABATA',
      exercisesCompleted: currentExerciseIndex + 1,
      totalRounds: currentRound,
      workoutTime: sessionTime,
      intervalsCompleted: currentExerciseIndex * totalRounds + currentRound
    });
  };

  const formatTime = (seconds: number) => {
    return Math.ceil(seconds).toString();
  };

  const getOverallProgress = () => {
    const completedIntervals = currentExerciseIndex * totalRounds + (currentRound - 1);
    const totalIntervals = totalExercises * totalRounds;
    return (completedIntervals / totalIntervals) * 100;
  };

  const getNextExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      return workoutData.exercises[currentExerciseIndex + 1];
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with red gradient for Tabata */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-2xl">
                🔥
              </div>
              <div>
                <h1 className="text-2xl font-bold">Tabata Session</h1>
                <p className="text-white text-opacity-90">
                  High-Intensity Interval Training
                </p>
              </div>
            </div>
            
            {/* Phase Timer */}
            <div className="relative">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                isWorkPhase ? 'bg-white' : 'bg-gray-800'
              }`}>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${
                    isWorkPhase ? 'text-red-600' : 'text-white'
                  }`}>
                    {formatTime(phaseTimeRemaining)}
                  </div>
                  <div className={`text-xs font-medium ${
                    isWorkPhase ? 'text-red-500' : 'text-gray-300'
                  }`}>
                    {isWorkPhase ? 'WORK' : 'REST'}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center">
                <div className="text-sm text-white opacity-90">
                  {isPaused ? 'Paused' : `${isWorkPhase ? 'Work' : 'Rest'} Phase`}
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-white text-opacity-90 mb-2">
              <span>
                Exercise {currentExerciseIndex + 1}/{totalExercises} • Round {currentRound}/{totalRounds}
              </span>
              <span>{Math.round(getOverallProgress())}% Complete</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
              <motion.div
                className="bg-white rounded-full h-3"
                initial={{ width: 0 }}
                animate={{ width: `${getOverallProgress()}%` }}
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
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isWorkPhase 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {isWorkPhase ? 'WORK' : 'REST'}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {currentRound}/{totalRounds}
                  </span>
                </div>
              </div>

              {/* Phase Progress Bar */}
              <div className="mb-8">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <motion.div
                    className={`h-4 rounded-full transition-colors ${
                      isWorkPhase ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${phaseProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>{isWorkPhase ? 'Work Phase' : 'Rest Phase'}</span>
                  <span>{formatTime(phaseTimeRemaining)}s remaining</span>
                </div>
              </div>

              {/* Exercise Parameters */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {workTime}s
                  </div>
                  <div className="text-gray-600 font-medium">Work Time</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {restTime}s
                  </div>
                  <div className="text-gray-600 font-medium">Rest Time</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {totalRounds}
                  </div>
                  <div className="text-gray-600 font-medium">Total Rounds</div>
                </div>
              </div>

              {/* Phase Instructions */}
              <div className={`rounded-xl p-6 ${
                isWorkPhase 
                  ? 'bg-red-50 border-2 border-red-200' 
                  : 'bg-blue-50 border-2 border-blue-200'
              }`}>
                <h3 className={`font-semibold mb-2 ${
                  isWorkPhase ? 'text-red-900' : 'text-blue-900'
                }`}>
                  {isWorkPhase ? 'WORK PHASE' : 'REST PHASE'}
                </h3>
                <p className={`${
                  isWorkPhase ? 'text-red-800' : 'text-blue-800'
                }`}>
                  {isWorkPhase 
                    ? 'Go all out! Maximum intensity for maximum results.'
                    : 'Active recovery. Catch your breath and prepare for the next round.'
                  }
                </p>
              </div>

              {/* Next Exercise Preview */}
              {getNextExercise() && (
                <div className="mt-6 bg-yellow-50 rounded-xl p-4">
                  <h3 className="font-semibold text-yellow-900 mb-2">Next Exercise</h3>
                  <p className="text-yellow-800">
                    {getNextExercise()?.name} - {getNextExercise()?.rounds} rounds
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Exercise List */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Exercise List</h3>
              <div className="space-y-2">
                {workoutData.exercises.map((exercise, index) => (
                  <div
                    key={exercise.exerciseId}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      index === currentExerciseIndex
                        ? 'bg-red-100 border-2 border-red-300'
                        : index < currentExerciseIndex
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === currentExerciseIndex
                        ? 'bg-red-500 text-white'
                        : index < currentExerciseIndex
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {index < currentExerciseIndex ? '✓' : index + 1}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-gray-800">{exercise.name}</div>
                      <div className="text-sm text-gray-600">
                        {exercise.workTimeSeconds}s work • {exercise.restTimeSeconds}s rest • {exercise.rounds} rounds
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
                      : 'bg-yellow-500 text-white hover:bg-yellow-600'
                  }`}
                >
                  {isPaused ? <FaPlay /> : <FaPause />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>
                
                <button
                  onClick={handleNext}
                  className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <FaStepForward />
                  <span>Next Exercise</span>
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
                  <span className="text-gray-600 font-medium">Exercise</span>
                  <span className="text-xl font-bold text-gray-900">{currentExerciseIndex + 1}/{totalExercises}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Round</span>
                  <span className="text-xl font-bold text-gray-900">{currentRound}/{totalRounds}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Phase</span>
                  <span className={`text-xl font-bold ${
                    isWorkPhase ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {isWorkPhase ? 'WORK' : 'REST'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total Time</span>
                  <span className="text-xl font-bold text-gray-900">{Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')}</span>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Exercise Complete!</h3>
              <p className="text-gray-600">
                {currentExercise?.name} finished • Great work!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TabataSessionInterface;