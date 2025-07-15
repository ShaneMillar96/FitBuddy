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
  const { data: availableExercises } = useExercises();

  const updateRoundCount = (rounds: number) => {
    const validRounds = Math.max(1, Math.min(20, rounds));
    const exercisesPerRound = workoutData.exercises.length;
    onChange({
      ...workoutData,
      roundCount: validRounds,
      exercisesPerRound,
      totalMinutes: exercisesPerRound * validRounds
    });
  };

  const addExerciseToRound = (exercise: Exercise) => {
    const newExercise: EMOMExercise = {
      exerciseId: exercise.id,
      orderInWorkout: workoutData.exercises.length + 1,
      roundPosition: workoutData.exercises.length + 1,
      reps: 10, // Default reps
      name: exercise.name,
      weightDescription: "bodyweight"
    };

    const updatedExercises = [...workoutData.exercises, newExercise];
    onChange({
      ...workoutData,
      exercises: updatedExercises,
      exercisesPerRound: updatedExercises.length,
      totalMinutes: updatedExercises.length * workoutData.roundCount
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
    // Reorder round positions after removal
    const reorderedExercises = updatedExercises.map((ex, index) => ({
      ...ex,
      roundPosition: index + 1,
      orderInWorkout: index + 1
    }));
    
    onChange({
      ...workoutData,
      exercises: reorderedExercises,
      exercisesPerRound: reorderedExercises.length,
      totalMinutes: reorderedExercises.length * workoutData.roundCount
    });
  };

  const handleAddExercise = () => {
    setShowExercisePicker(true);
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    addExerciseToRound(exercise);
    setShowExercisePicker(false);
  };

  return (
    <div className="space-y-6">
      {/* EMOM Settings */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center mb-4">
          <FaClock className="text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-blue-800">EMOM Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-2">
              Number of Rounds
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={workoutData.roundCount}
              onChange={(e) => updateRoundCount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-end">
            <div className="text-sm text-blue-600">
              <div className="font-medium">Exercises per Round</div>
              <div className="text-lg font-bold">{workoutData.exercisesPerRound}</div>
            </div>
          </div>
          
          <div className="flex items-end">
            <div className="text-sm text-blue-600">
              <div className="font-medium">Total Duration</div>
              <div className="text-lg font-bold">{workoutData.totalMinutes}:00</div>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-sm text-blue-700">
            <FaPlay className="inline mr-1" />
            <strong>EMOM:</strong> Every minute on the minute, complete the exercise pattern below. 
            Each round repeats the same exercises in order for {workoutData.roundCount} total rounds.
          </p>
        </div>
      </div>

      {/* Round Pattern Builder */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-800">Round Pattern</h4>
          <button
            onClick={handleAddExercise}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            Add Exercise
          </button>
        </div>
        
        {workoutData.exercises.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence>
              {workoutData.exercises.map((exercise, index) => (
                <motion.div
                  key={`${exercise.exerciseId}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-lg border-2 border-gray-200 p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {exercise.roundPosition}
                      </div>
                      <span className="ml-3 font-medium text-gray-800">
                        {exercise.name}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => removeExercise(index)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Exercise Parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Reps</label>
                      <input
                        type="number"
                        min="1"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(index, { reps: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Weight</label>
                      <input
                        type="text"
                        value={exercise.weightDescription || ''}
                        onChange={(e) => updateExercise(index, { weightDescription: e.target.value })}
                        placeholder="bodyweight"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Notes</label>
                      <input
                        type="text"
                        value={exercise.notes || ''}
                        onChange={(e) => updateExercise(index, { notes: e.target.value })}
                        placeholder="Optional notes..."
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <p className="text-lg font-medium mb-2">No exercises in pattern</p>
              <p className="text-sm">Click "Add Exercise" to start building your EMOM pattern</p>
            </div>
          </div>
        )}
      </div>

      {/* Exercise Picker Modal */}
      <ExercisePicker
        isOpen={showExercisePicker}
        onClose={() => setShowExercisePicker(false)}
        onSelect={handleExerciseSelect}
        availableExercises={availableExercises || []}
      />

      {/* Workout Preview */}
      {workoutData.exercises.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">Workout Preview</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Total Duration: <span className="font-medium">{workoutData.totalMinutes} minutes</span></div>
            <div>Exercises per Round: <span className="font-medium">{workoutData.exercisesPerRound}</span></div>
            <div>Number of Rounds: <span className="font-medium">{workoutData.roundCount}</span></div>
          </div>
          
          {workoutData.roundCount > 1 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Pattern:</strong> Repeat the {workoutData.exercisesPerRound} exercise{workoutData.exercisesPerRound !== 1 ? 's' : ''} above for {workoutData.roundCount} rounds, 
                starting each round on the minute.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EMOMBuilder;