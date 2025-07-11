import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaStopwatch, FaBolt, FaArrowUp, FaArrowDown, FaRedo } from "react-icons/fa";
import { ForTimeExercise, ForTimeWorkoutData } from "@/interfaces/workout-types";
import { useExercises, Exercise } from "@/hooks/useExercises";
import ExercisePicker from "../ExercisePicker";

interface ForTimeBuilderProps {
  workoutData: ForTimeWorkoutData;
  onChange: (data: ForTimeWorkoutData) => void;
}

const ForTimeBuilder = ({ workoutData, onChange }: ForTimeBuilderProps) => {
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const { data: availableExercises } = useExercises();

  const updateTotalRounds = (rounds: number) => {
    const validRounds = Math.max(1, Math.min(50, rounds));
    onChange({
      ...workoutData,
      totalRounds: validRounds
    });
  };

  const addExercise = (exercise: Exercise) => {
    const newExercise: ForTimeExercise = {
      exerciseId: exercise.id,
      orderInWorkout: workoutData.exercises.length + 1,
      reps: 21, // Common CrossFit rep scheme starting point
      name: exercise.name,
      weightDescription: "bodyweight"
    };

    onChange({
      ...workoutData,
      exercises: [...workoutData.exercises, newExercise]
    });
  };

  const updateExercise = (exerciseIndex: number, updates: Partial<ForTimeExercise>) => {
    const updatedExercises = workoutData.exercises.map((ex, index) =>
      index === exerciseIndex ? { ...ex, ...updates } : ex
    );
    onChange({
      ...workoutData,
      exercises: updatedExercises
    });
  };

  const removeExercise = (exerciseIndex: number) => {
    const updatedExercises = workoutData.exercises
      .filter((_, index) => index !== exerciseIndex)
      .map((ex, index) => ({ ...ex, orderInWorkout: index + 1 }));
    
    onChange({
      ...workoutData,
      exercises: updatedExercises
    });
  };

  const moveExercise = (fromIndex: number, toIndex: number) => {
    const exercises = [...workoutData.exercises];
    const [movedExercise] = exercises.splice(fromIndex, 1);
    exercises.splice(toIndex, 0, movedExercise);
    
    // Update order
    const updatedExercises = exercises.map((ex, index) => ({
      ...ex,
      orderInWorkout: index + 1
    }));

    onChange({
      ...workoutData,
      exercises: updatedExercises
    });
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    addExercise(exercise);
    setShowExercisePicker(false);
  };

  const calculateTotalReps = () => {
    const baseReps = workoutData.exercises.reduce((sum, ex) => sum + ex.reps, 0);
    return baseReps * (workoutData.totalRounds || 1);
  };

  const getEstimatedTime = () => {
    // Rough estimate: 2.5 seconds per rep + transition time
    const totalReps = calculateTotalReps();
    const transitionTime = workoutData.exercises.length * (workoutData.totalRounds || 1) * 5; // 5s per transition
    const estimatedSeconds = (totalReps * 2.5) + transitionTime;
    return Math.ceil(estimatedSeconds / 60);
  };

  const isMultipleRounds = (workoutData.totalRounds || 1) > 1;

  return (
    <div className="space-y-6">
      {/* For Time Settings */}
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <div className="flex items-center mb-4">
          <FaStopwatch className="text-yellow-600 mr-2" />
          <h3 className="text-lg font-semibold text-yellow-800">For Time Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-2">
              Number of Rounds
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={workoutData.totalRounds || 1}
              onChange={(e) => updateTotalRounds(Number(e.target.value))}
              className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          
          {workoutData.exercises.length > 0 && (
            <>
              <div className="flex items-end">
                <div className="text-sm text-yellow-600">
                  <div className="font-medium">Total Reps</div>
                  <div className="text-lg font-bold">{calculateTotalReps()} reps</div>
                </div>
              </div>

              <div className="flex items-end">
                <div className="text-sm text-yellow-600">
                  <div className="font-medium">Est. Time</div>
                  <div className="text-lg font-bold">~{getEstimatedTime()} min</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Explanation */}
        <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
          <p className="text-sm text-yellow-700">
            <FaBolt className="inline mr-1" />
            <strong>For Time:</strong> Complete all exercises {isMultipleRounds ? `for ${workoutData.totalRounds} rounds` : ''} 
            as fast as possible. Record your total completion time.
          </p>
        </div>
      </div>

      {/* Exercise Sequence */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-800">
            Exercise Sequence {isMultipleRounds && `(${workoutData.totalRounds} Rounds)`}
          </h4>
          <button
            onClick={() => setShowExercisePicker(true)}
            className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <FaPlus className="mr-2" />
            Add Exercise
          </button>
        </div>

        {workoutData.exercises.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <FaBolt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">Design Your Workout</h4>
            <p className="text-gray-500 mb-4">
              Add exercises to create the sequence that will be completed for time
            </p>
            <button
              onClick={() => setShowExercisePicker(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Add First Exercise
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {workoutData.exercises.map((exercise, index) => (
                <motion.div
                  key={exercise.exerciseId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:border-yellow-300 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Position and Move Controls */}
                    <div className="flex flex-col items-center space-y-1">
                      <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {exercise.orderInWorkout}
                      </div>
                      
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => moveExercise(index, Math.max(0, index - 1))}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-yellow-500 disabled:opacity-30 transition-colors"
                          title="Move up"
                        >
                          <FaArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => moveExercise(index, Math.min(workoutData.exercises.length - 1, index + 1))}
                          disabled={index === workoutData.exercises.length - 1}
                          className="p-1 text-gray-400 hover:text-yellow-500 disabled:opacity-30 transition-colors"
                          title="Move down"
                        >
                          <FaArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Exercise Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-semibold text-gray-800">{exercise.name}</h5>
                        <button
                          onClick={() => removeExercise(index)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                          title="Remove exercise"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Exercise Parameters */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Reps {isMultipleRounds && '(per round)'}
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={exercise.reps}
                            onChange={(e) => updateExercise(index, { reps: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Weight/Load
                          </label>
                          <input
                            type="text"
                            value={exercise.weightDescription || ''}
                            onChange={(e) => updateExercise(index, { weightDescription: e.target.value })}
                            placeholder="bodyweight, 135lb, etc."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Notes
                          </label>
                          <input
                            type="text"
                            value={exercise.notes || ''}
                            onChange={(e) => updateExercise(index, { notes: e.target.value })}
                            placeholder="Optional notes..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          />
                        </div>
                      </div>

                      {/* Round-specific info */}
                      {isMultipleRounds && (
                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-600">
                          Total reps for this exercise: <span className="font-medium">
                            {exercise.reps} × {workoutData.totalRounds} rounds = {exercise.reps * (workoutData.totalRounds || 1)} reps
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="space-y-1">
              <div>Workout Type: <span className="font-medium">For Time</span></div>
              <div>Total Rounds: <span className="font-medium">{workoutData.totalRounds || 1}</span></div>
              <div>Exercises per Round: <span className="font-medium">{workoutData.exercises.length}</span></div>
            </div>
            <div className="space-y-1">
              <div>Total Reps: <span className="font-medium">{calculateTotalReps()}</span></div>
              <div>Estimated Time: <span className="font-medium">~{getEstimatedTime()} minutes</span></div>
            </div>
          </div>
          
          {/* Workout Breakdown */}
          <div className="mt-4 p-3 bg-white rounded-lg border">
            <h5 className="font-medium text-gray-800 mb-2">
              Complete {isMultipleRounds ? `${workoutData.totalRounds} rounds of:` : 'the following:'}
            </h5>
            <div className="space-y-1 text-sm">
              {workoutData.exercises.map((exercise, index) => (
                <div key={index} className="flex justify-between">
                  <span>{exercise.reps} {exercise.name}</span>
                  <span className="text-gray-600">
                    {exercise.weightDescription && `@ ${exercise.weightDescription}`}
                  </span>
                </div>
              ))}
            </div>
            {isMultipleRounds && (
              <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                <FaRedo className="inline mr-1" />
                Repeat this sequence {workoutData.totalRounds} times for a total of {calculateTotalReps()} reps
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ForTimeBuilder;