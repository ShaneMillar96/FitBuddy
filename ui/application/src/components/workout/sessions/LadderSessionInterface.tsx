import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, 
  FaPause, 
  FaStepForward, 
  FaFlag, 
  FaClock,
  FaCheckCircle,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaArrowRight
} from 'react-icons/fa';
import { LadderWorkoutData } from '@/interfaces/workout-types';
import { Workout } from '@/interfaces/workout';

interface LadderSessionInterfaceProps {
  workout: Workout;
  workoutData: LadderWorkoutData;
  onComplete: (result: any) => void;
  onPause: () => void;
  onResume: () => void;
  onSkip: () => void;
  isPaused: boolean;
  sessionTime: number;
}

const LadderSessionInterface: React.FC<LadderSessionInterfaceProps> = ({
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
  const [currentStep, setCurrentStep] = useState(0);
  const [exercisesCompleted, setExercisesCompleted] = useState(0);
  const [showStepComplete, setShowStepComplete] = useState(false);
  const [showExerciseComplete, setShowExerciseComplete] = useState(false);

  const currentExercise = workoutData.exercises[currentExerciseIndex];
  const totalExercises = workoutData.exercises.length;

  // Calculate ladder steps for current exercise
  const calculateLadderSteps = (exercise: any) => {
    const steps = [];
    const { startReps, endReps, increment, ladderType } = exercise;
    
    if (ladderType === 'ascending') {
      for (let reps = startReps; reps <= endReps; reps += increment) {
        steps.push(reps);
      }
    } else if (ladderType === 'descending') {
      for (let reps = startReps; reps >= endReps; reps -= increment) {
        steps.push(reps);
      }
    } else if (ladderType === 'pyramid') {
      // Ascending
      for (let reps = startReps; reps <= endReps; reps += increment) {
        steps.push(reps);
      }
      // Descending (excluding the peak)
      for (let reps = endReps - increment; reps >= startReps; reps -= increment) {
        steps.push(reps);
      }
    }
    
    return steps;
  };

  const ladderSteps = currentExercise ? calculateLadderSteps(currentExercise) : [];
  const totalSteps = ladderSteps.length;
  const currentReps = ladderSteps[currentStep] || 0;
  const progressPercentage = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  const handleNext = () => {
    setExercisesCompleted(prev => prev + 1);
    
    if (currentStep < totalSteps - 1) {
      // Move to next step in ladder
      setCurrentStep(prev => prev + 1);
      setShowStepComplete(true);
      setTimeout(() => setShowStepComplete(false), 1500);
    } else {
      // Exercise complete
      if (currentExerciseIndex < totalExercises - 1) {
        // Move to next exercise
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentStep(0);
        setShowExerciseComplete(true);
        setTimeout(() => setShowExerciseComplete(false), 2000);
      } else {
        // Workout complete
        onComplete({
          type: 'LADDER',
          exercisesCompleted: totalExercises,
          stepsCompleted: calculateTotalSteps(),
          totalVolume: calculateTotalVolume(),
          completionTime: sessionTime
        });
      }
    }
  };

  const handleFinish = () => {
    onComplete({
      type: 'LADDER',
      exercisesCompleted: currentExerciseIndex + 1,
      stepsCompleted: calculateCompletedSteps(),
      totalVolume: calculateCompletedVolume(),
      completionTime: sessionTime
    });
  };

  const calculateTotalSteps = () => {
    return workoutData.exercises.reduce((total, exercise) => {
      return total + calculateLadderSteps(exercise).length;
    }, 0);
  };

  const calculateCompletedSteps = () => {
    let completed = 0;
    for (let i = 0; i < currentExerciseIndex; i++) {
      completed += calculateLadderSteps(workoutData.exercises[i]).length;
    }
    completed += currentStep;
    return completed;
  };

  const calculateTotalVolume = () => {
    return workoutData.exercises.reduce((total, exercise) => {
      const steps = calculateLadderSteps(exercise);
      return total + steps.reduce((sum, reps) => sum + reps, 0);
    }, 0);
  };

  const calculateCompletedVolume = () => {
    let volume = 0;
    
    // Completed exercises
    for (let i = 0; i < currentExerciseIndex; i++) {
      const steps = calculateLadderSteps(workoutData.exercises[i]);
      volume += steps.reduce((sum, reps) => sum + reps, 0);
    }
    
    // Current exercise completed steps
    if (currentExercise) {
      const steps = calculateLadderSteps(currentExercise);
      for (let i = 0; i < currentStep; i++) {
        volume += steps[i];
      }
    }
    
    return volume;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLadderDirection = (ladderType: string) => {
    switch (ladderType) {
      case 'ascending':
        return { icon: FaArrowUp, color: 'text-green-600', label: 'Ascending' };
      case 'descending':
        return { icon: FaArrowDown, color: 'text-red-600', label: 'Descending' };
      case 'pyramid':
        return { icon: FaChartLine, color: 'text-purple-600', label: 'Pyramid' };
      default:
        return { icon: FaArrowRight, color: 'text-gray-600', label: 'Linear' };
    }
  };

  const getNextStep = () => {
    if (currentStep < totalSteps - 1) {
      return ladderSteps[currentStep + 1];
    }
    return null;
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with purple gradient for Ladder */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-2xl">
                📈
              </div>
              <div>
                <h1 className="text-2xl font-bold">Ladder Session</h1>
                <p className="text-white text-opacity-90">
                  {currentExercise?.ladderType || 'Progressive'} Rep Pattern
                </p>
              </div>
            </div>
            
            {/* Timer */}
            <div className="relative">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mx-auto mb-1"></div>
                  <div className="text-black text-lg font-bold">{formatTime(sessionTime)}</div>
                </div>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center">
                <div className="text-sm text-white opacity-90">
                  {isPaused ? 'Paused' : 'Total Time'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-white text-opacity-90 mb-2">
              <span>
                Exercise {currentExerciseIndex + 1}/{totalExercises} • Step {currentStep + 1}/{totalSteps}
              </span>
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
              key={`${currentExercise?.exerciseId}-${currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  {currentExercise?.name || 'Exercise'}
                </h2>
                <div className="flex items-center space-x-2">
                  {(() => {
                    const direction = getLadderDirection(currentExercise?.ladderType || 'ascending');
                    return (
                      <span className={`px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium flex items-center ${direction.color}`}>
                        <direction.icon className="w-3 h-3 mr-1" />
                        {direction.label}
                      </span>
                    );
                  })()}
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    Step {currentStep + 1}/{totalSteps}
                  </span>
                </div>
              </div>

              {/* Current Step */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-purple-50 rounded-xl p-6 text-center border-2 border-purple-200">
                  <div className="text-5xl font-bold text-purple-600 mb-2">
                    {currentReps}
                  </div>
                  <div className="text-purple-800 font-medium">Current Reps</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {currentExercise?.weightDescription || 'Bodyweight'}
                  </div>
                  <div className="text-gray-600 font-medium">Weight</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {getNextStep() || 'Final'}
                  </div>
                  <div className="text-gray-600 font-medium">Next Step</div>
                </div>
              </div>

              {/* Ladder Visualization */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Ladder Progress</h3>
                <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                  {ladderSteps.map((reps, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold border-2 ${
                        getStepStatus(index) === 'completed'
                          ? 'bg-green-100 border-green-300 text-green-700'
                          : getStepStatus(index) === 'current'
                          ? 'bg-purple-100 border-purple-300 text-purple-700'
                          : 'bg-gray-100 border-gray-300 text-gray-500'
                      }`}
                    >
                      {reps}
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="font-semibold text-purple-900 mb-2">Instructions</h3>
                <p className="text-purple-800">
                  Complete {currentReps} reps of {currentExercise?.name}. 
                  {getNextStep() && ` Next step: ${getNextStep()} reps.`}
                </p>
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
            {/* Exercise List */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Exercise List</h3>
              <div className="space-y-3">
                {workoutData.exercises.map((exercise, index) => {
                  const steps = calculateLadderSteps(exercise);
                  const direction = getLadderDirection(exercise.ladderType);
                  
                  return (
                    <div
                      key={exercise.exerciseId}
                      className={`p-4 rounded-lg transition-colors ${
                        index === currentExerciseIndex
                          ? 'bg-purple-100 border-2 border-purple-300'
                          : index < currentExerciseIndex
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-800">{exercise.name}</div>
                        <div className={`flex items-center ${direction.color}`}>
                          <direction.icon className="w-4 h-4 mr-1" />
                          <span className="text-sm">{direction.label}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {exercise.startReps}-{exercise.endReps} reps • {steps.length} steps
                      </div>
                    </div>
                  );
                })}
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
                  className="w-full px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <FaStepForward />
                  <span>Complete Step</span>
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
                  <span className="text-gray-600 font-medium">Steps Completed</span>
                  <span className="text-xl font-bold text-purple-600">{calculateCompletedSteps()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total Volume</span>
                  <span className="text-xl font-bold text-gray-900">{calculateCompletedVolume()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Current Step</span>
                  <span className="text-xl font-bold text-gray-900">{currentStep + 1}/{totalSteps}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Exercise</span>
                  <span className="text-xl font-bold text-gray-900">{currentExerciseIndex + 1}/{totalExercises}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Complete Animation */}
      <AnimatePresence>
        {showStepComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          >
            <div className="bg-white rounded-2xl p-8 text-center">
              <FaCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Step Complete!</h3>
              <p className="text-gray-600">
                {currentReps} reps completed • Moving to next step
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exercise Complete Animation */}
      <AnimatePresence>
        {showExerciseComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          >
            <div className="bg-white rounded-2xl p-8 text-center">
              <FaCheckCircle className="mx-auto text-5xl text-purple-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Exercise Complete!</h3>
              <p className="text-gray-600">
                {currentExercise?.name} ladder finished • Great progression!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LadderSessionInterface;