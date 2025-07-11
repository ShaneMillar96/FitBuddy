import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaClock, FaRedo, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { AMRAPExercise, AMRAPWorkoutData } from "@/interfaces/workout-types";
import { useExercises, Exercise } from "@/hooks/useExercises";
import ExercisePicker from "../ExercisePicker";

interface AMRAPBuilderProps {
  workoutData: AMRAPWorkoutData;
  onChange: (data: AMRAPWorkoutData) => void;
}

const AMRAPBuilder = ({ workoutData, onChange }: AMRAPBuilderProps) => {
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const { data: availableExercises } = useExercises();

  const updateTimeCapMinutes = (minutes: number) => {
    const validMinutes = Math.max(1, Math.min(120, minutes));
    onChange({
      ...workoutData,
      timeCapMinutes: validMinutes
    });
  };

  const addExerciseToRound = (exercise: Exercise) => {
    const newExercise: AMRAPExercise = {
      exerciseId: exercise.id,
      orderInWorkout: workoutData.exercises.length + 1,
      roundPosition: workoutData.exercises.length + 1,
      reps: 10, // Default reps
      name: exercise.name,
      weightDescription: "bodyweight"
    };

    onChange({
      ...workoutData,
      exercises: [...workoutData.exercises, newExercise]
    });
  };

  const updateExercise = (exerciseIndex: number, updates: Partial<AMRAPExercise>) => {
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
      .map((ex, index) => ({ ...ex, roundPosition: index + 1, orderInWorkout: index + 1 }));
    
    onChange({
      ...workoutData,
      exercises: updatedExercises
    });
  };

  const moveExercise = (fromIndex: number, toIndex: number) => {
    const exercises = [...workoutData.exercises];
    const [movedExercise] = exercises.splice(fromIndex, 1);
    exercises.splice(toIndex, 0, movedExercise);
    
    // Update positions
    const updatedExercises = exercises.map((ex, index) => ({
      ...ex,
      roundPosition: index + 1,
      orderInWorkout: index + 1
    }));

    onChange({
      ...workoutData,
      exercises: updatedExercises
    });
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    addExerciseToRound(exercise);
    setShowExercisePicker(false);
  };

  const calculateEstimatedRoundTime = () => {
    // Rough estimate: assume 2-3 seconds per rep + 30s transition time
    const totalReps = workoutData.exercises.reduce((sum, ex) => sum + ex.reps, 0);
    const estimatedSeconds = (totalReps * 2.5) + 30;
    return Math.ceil(estimatedSeconds / 60);
  };

  const estimatedRounds = workoutData.exercises.length > 0 
    ? Math.floor(workoutData.timeCapMinutes / calculateEstimatedRoundTime())
    : 0;

  return (
    <div className="space-y-6">
      {/* AMRAP Settings */}
      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
        <div className="flex items-center mb-4">
          <FaClock className="text-orange-600 mr-2" />
          <h3 className="text-lg font-semibold text-orange-800">AMRAP Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-orange-700 mb-2">
              Time Cap (Minutes)
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={workoutData.timeCapMinutes}
              onChange={(e) => updateTimeCapMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <div className="flex items-end">
            <div className="text-sm text-orange-600">
              <div className="font-medium">Workout Duration</div>
              <div className="text-lg font-bold">{workoutData.timeCapMinutes}:00</div>
            </div>
          </div>

          {workoutData.exercises.length > 0 && (
            <div className="flex items-end">
              <div className="text-sm text-orange-600">
                <div className="font-medium">Estimated Rounds</div>
                <div className="text-lg font-bold">{estimatedRounds} rounds</div>
              </div>
            </div>
          )}
        </div>

        {/* Explanation */}
        <div className="mt-4 p-3 bg-orange-100 rounded-lg">
          <p className="text-sm text-orange-700">
            <FaRedo className="inline mr-1" />
            <strong>AMRAP:</strong> Complete the round of exercises below as many times as possible 
            within the {workoutData.timeCapMinutes}-minute time cap. Track your total rounds + any partial reps.
          </p>
        </div>
      </div>

      {/* Round Definition */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-800">Round Definition</h4>
          <button
            onClick={() => setShowExercisePicker(true)}
            className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <FaPlus className="mr-2" />
            Add Exercise
          </button>
        </div>

        {workoutData.exercises.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <FaRedo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">Define Your Round</h4>
            <p className="text-gray-500 mb-4">
              Add exercises to create the round that will be repeated during the AMRAP
            </p>
            <button
              onClick={() => setShowExercisePicker(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
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
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:border-orange-300 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Position and Move Controls */}
                    <div className="flex flex-col items-center space-y-1">
                      <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {exercise.roundPosition}
                      </div>
                      
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => moveExercise(index, Math.max(0, index - 1))}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-orange-500 disabled:opacity-30 transition-colors"
                          title="Move up"
                        >
                          <FaArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => moveExercise(index, Math.min(workoutData.exercises.length - 1, index + 1))}
                          disabled={index === workoutData.exercises.length - 1}
                          className="p-1 text-gray-400 hover:text-orange-500 disabled:opacity-30 transition-colors"
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
                            Reps per Round
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={exercise.reps}
                            onChange={(e) => updateExercise(index, { reps: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      </div>
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
              <div>Time Cap: <span className="font-medium">{workoutData.timeCapMinutes} minutes</span></div>
              <div>Exercises in Round: <span className="font-medium">{workoutData.exercises.length}</span></div>
              <div>Estimated Round Time: <span className="font-medium">~{calculateEstimatedRoundTime()} minutes</span></div>
            </div>
            <div className="space-y-1">
              <div>Estimated Rounds: <span className="font-medium">{estimatedRounds} rounds</span></div>
              <div>Total Reps per Round: <span className="font-medium">
                {workoutData.exercises.reduce((sum, ex) => sum + ex.reps, 0)} reps
              </span></div>
            </div>
          </div>
          
          {/* Round Summary */}
          <div className="mt-4 p-3 bg-white rounded-lg border">
            <h5 className="font-medium text-gray-800 mb-2">One Round Consists Of:</h5>
            <div className="space-y-1 text-sm">
              {workoutData.exercises.map((exercise, index) => (
                <div key={index} className="flex justify-between">
                  <span>{exercise.roundPosition}. {exercise.name}</span>
                  <span className="text-gray-600">
                    {exercise.reps} reps {exercise.weightDescription && `@ ${exercise.weightDescription}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AMRAPBuilder;