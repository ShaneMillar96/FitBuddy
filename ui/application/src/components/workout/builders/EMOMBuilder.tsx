import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaClock, FaPlay } from "react-icons/fa";
import { EMOMExercise, EMOMWorkoutData } from "@/interfaces/workout-types";
import { useExercises, Exercise } from "@/hooks/useExercises";
import ExercisePicker from "../ExercisePicker";

interface EMOMBuilderProps {
  workoutData: EMOMWorkoutData;
  onChange: (data: EMOMWorkoutData) => void;
}

const EMOMBuilder = ({ workoutData, onChange }: EMOMBuilderProps) => {
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [selectedMinute, setSelectedMinute] = useState<number | null>(null);
  const { data: availableExercises } = useExercises();

  const updateTotalMinutes = (minutes: number) => {
    // Ensure we don't remove exercises when reducing minutes
    const validMinutes = Math.max(1, Math.min(60, minutes));
    onChange({
      ...workoutData,
      totalMinutes: validMinutes,
      exercises: workoutData.exercises.filter(ex => ex.minute <= validMinutes)
    });
  };

  const addExerciseToMinute = (minute: number, exercise: Exercise) => {
    const newExercise: EMOMExercise = {
      exerciseId: exercise.id,
      orderInWorkout: workoutData.exercises.length + 1,
      minute,
      reps: 10, // Default reps
      name: exercise.name,
      weightDescription: "bodyweight"
    };

    onChange({
      ...workoutData,
      exercises: [...workoutData.exercises, newExercise]
    });
  };

  const updateExercise = (exerciseIndex: number, updates: Partial<EMOMExercise>) => {
    const updatedExercises = workoutData.exercises.map((ex, index) =>
      index === exerciseIndex ? { ...ex, ...updates } : ex
    );
    onChange({
      ...workoutData,
      exercises: updatedExercises
    });
  };

  const removeExercise = (exerciseIndex: number) => {
    const updatedExercises = workoutData.exercises.filter((_, index) => index !== exerciseIndex);
    onChange({
      ...workoutData,
      exercises: updatedExercises
    });
  };

  const getExercisesForMinute = (minute: number): EMOMExercise[] => {
    return workoutData.exercises.filter(ex => ex.minute === minute);
  };

  const handleAddExercise = (minute: number) => {
    setSelectedMinute(minute);
    setShowExercisePicker(true);
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    if (selectedMinute) {
      addExerciseToMinute(selectedMinute, exercise);
    }
    setShowExercisePicker(false);
    setSelectedMinute(null);
  };

  return (
    <div className="space-y-6">
      {/* EMOM Settings */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center mb-4">
          <FaClock className="text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-blue-800">EMOM Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">
              Total Minutes
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={workoutData.totalMinutes}
              onChange={(e) => updateTotalMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-end">
            <div className="text-sm text-blue-600">
              <div className="font-medium">Workout Duration</div>
              <div className="text-lg font-bold">{workoutData.totalMinutes}:00</div>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-sm text-blue-700">
            <FaPlay className="inline mr-1" />
            <strong>EMOM:</strong> At the start of each minute, complete the assigned exercises. 
            Use remaining time to rest before the next minute begins.
          </p>
        </div>
      </div>

      {/* Minutes Timeline */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">Minute-by-Minute Breakdown</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: workoutData.totalMinutes }, (_, i) => {
            const minute = i + 1;
            const minuteExercises = getExercisesForMinute(minute);
            
            return (
              <motion.div
                key={minute}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-lg border-2 border-gray-200 p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {minute}
                    </div>
                    <span className="ml-2 font-medium text-gray-700">Minute {minute}</span>
                  </div>
                  
                  <button
                    onClick={() => handleAddExercise(minute)}
                    className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                    title="Add exercise to this minute"
                  >
                    <FaPlus className="w-4 h-4" />
                  </button>
                </div>

                {/* Exercises for this minute */}
                <div className="space-y-2">
                  <AnimatePresence>
                    {minuteExercises.map((exercise, exerciseIdx) => {
                      const globalIndex = workoutData.exercises.findIndex(ex => 
                        ex.minute === minute && ex.exerciseId === exercise.exerciseId
                      );
                      
                      return (
                        <motion.div
                          key={`${minute}-${exercise.exerciseId}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="bg-gray-50 rounded-lg p-3 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800 text-sm">
                              {exercise.name}
                            </span>
                            <button
                              onClick={() => removeExercise(globalIndex)}
                              className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                            >
                              <FaTrash className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Exercise Parameters */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Reps</label>
                              <input
                                type="number"
                                min="1"
                                value={exercise.reps}
                                onChange={(e) => updateExercise(globalIndex, { reps: Number(e.target.value) })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Weight</label>
                              <input
                                type="text"
                                value={exercise.weightDescription || ''}
                                onChange={(e) => updateExercise(globalIndex, { weightDescription: e.target.value })}
                                placeholder="bodyweight"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          {/* Notes */}
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Notes</label>
                            <input
                              type="text"
                              value={exercise.notes || ''}
                              onChange={(e) => updateExercise(globalIndex, { notes: e.target.value })}
                              placeholder="Optional notes..."
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {minuteExercises.length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
                        Click + to add exercises
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Exercise Picker Modal */}
      <ExercisePicker
        isOpen={showExercisePicker}
        onClose={() => {
          setShowExercisePicker(false);
          setSelectedMinute(null);
        }}
        onSelect={handleExerciseSelect}
        availableExercises={availableExercises || []}
      />

      {/* Workout Preview */}
      {workoutData.exercises.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">Workout Preview</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Total Duration: <span className="font-medium">{workoutData.totalMinutes} minutes</span></div>
            <div>Total Exercises: <span className="font-medium">{workoutData.exercises.length}</span></div>
            <div>Minutes with Exercises: <span className="font-medium">
              {new Set(workoutData.exercises.map(ex => ex.minute)).size}
            </span></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EMOMBuilder;