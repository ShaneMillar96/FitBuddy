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

// Mock workout exercises data for CrossFit
const mockCrossfitExercises = [
  {
    id: 1,
    name: "100 Thrusters",
    sets: 2,
    reps: 15,
    weight: "60kg",
    rest: "30s",
    instructions: [
      "Rear foot elevated on bench",
      "Lower into lunge position", 
      "Push through front heel"
    ]
  },
  {
    id: 2,
    name: "Pull-ups",
    sets: 3,
    reps: 10,
    weight: "Bodyweight",
    rest: "45s",
    instructions: [
      "Hang from pull-up bar",
      "Pull body up until chin over bar",
      "Lower with control"
    ]
  },
  {
    id: 3,
    name: "Box Jumps",
    sets: 3,
    reps: 20,
    weight: "24\" Box",
    rest: "60s",
    instructions: [
      "Stand facing box",
      "Jump onto box with both feet",
      "Step down with control"
    ]
  }
];

const WorkoutSession = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: workout, isLoading, error } = useWorkoutDetails(id!);
  
  // Session state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [showEndDialog, setShowEndDialog] = useState(false);
  
  // Stats
  const [exercisesCompleted, setExercisesCompleted] = useState(3);
  const [setsCompleted, setSetsCompleted] = useState(8);
  const [totalVolume, setTotalVolume] = useState(6630);

  const currentExercise = mockCrossfitExercises[currentExerciseIndex];
  const totalExercises = mockCrossfitExercises.length;
  const progressPercentage = 100; // Shown as complete in the image

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
        <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full"></div>
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

  const handleSkip = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      setShowEndDialog(true);
    }
  };

  const handleNext = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      setShowEndDialog(true);
    }
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleEndSession = () => {
    setIsSessionActive(false);
    navigate('/workouts');
  };

  const handleFinishWorkout = () => {
    setShowEndDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with orange gradient matching the image */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-2xl">
                🔥
              </div>
              <div>
                <h1 className="text-2xl font-bold">{currentExercise?.name || "100 Thrusters"}</h1>
                <p className="text-white text-opacity-90">Active Workout Session</p>
              </div>
            </div>
            
            {/* Timer - circular white container matching image */}
            <div className="relative">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1"></div>
                  <div className="text-black text-lg font-bold">{formatTime(sessionTime)}</div>
                </div>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center">
                <div className="text-sm text-white opacity-90">
                  {isPaused ? 'Paused' : 'Stopped'} • Total Timer
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-white text-opacity-90 mb-2">
              <span>Exercise {currentExerciseIndex + 1} of {totalExercises}</span>
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
          {/* Main Exercise Card - spans 2 columns */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentExercise?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  {currentExercise?.name || "Bulgarian Split Squat"}
                </h2>
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  CrossFit
                </span>
              </div>

              {/* Exercise stats in 2x2 grid matching the image */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {currentExercise?.sets || "2"}
                  </div>
                  <div className="text-gray-600 font-medium">Sets</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {currentExercise?.reps || "15"}
                  </div>
                  <div className="text-gray-600 font-medium">Reps</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {currentExercise?.weight || "60kg"}
                  </div>
                  <div className="text-gray-600 font-medium">Weight</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {currentExercise?.rest || "30s"}
                  </div>
                  <div className="text-gray-600 font-medium">Rest</div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Instructions</h3>
                <ol className="text-blue-800 space-y-2">
                  {(currentExercise?.instructions || [
                    "Rear foot elevated on bench",
                    "Lower into lunge position", 
                    "Push through front heel"
                  ]).map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 font-semibold mr-2">{index + 1}.</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Exercise Navigation */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Exercise Navigation</h3>
              <div className="space-y-3">
                <button
                  onClick={handleSkip}
                  className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <FaStepForward />
                  <span>Skip</span>
                </button>
                <button
                  onClick={handleNext}
                  className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <FaStepForward />
                  <span>Next</span>
                </button>
                <button
                  onClick={handleFinishWorkout}
                  className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <FaFlag />
                  <span>Finish Workout</span>
                </button>
              </div>
            </div>

            {/* Session Controls */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Session Controls</h3>
              <div className="space-y-3">
                <button
                  onClick={handlePauseResume}
                  className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <FaPlay />
                  <span>Resume</span>
                </button>
                
                <button
                  onClick={() => setShowEndDialog(true)}
                  className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <FaStop />
                  <span>End Session</span>
                </button>
              </div>
            </div>

            {/* Session Stats matching the image */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Session Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Exercises Completed</span>
                  <span className="text-xl font-bold text-gray-900">{exercisesCompleted}/{totalExercises}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Sets Completed</span>
                  <span className="text-xl font-bold text-gray-900">{setsCompleted}/8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total Volume</span>
                  <span className="text-xl font-bold text-gray-900">{totalVolume}kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  Amazing work! You've completed your CrossFit session. 
                  Your progress has been saved.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowEndDialog(false)}
                    className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Continue
                  </button>
                  <button
                    onClick={handleEndSession}
                    className="flex-1 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                  >
                    Finish
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