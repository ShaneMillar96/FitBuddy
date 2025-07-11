import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaChartLine, FaArrowUp, FaArrowDown, FaSort } from "react-icons/fa";
import { LadderExercise, LadderWorkoutData } from "@/interfaces/workout-types";
import { useExercises, Exercise } from "@/hooks/useExercises";
import ExercisePicker from "../ExercisePicker";

interface LadderBuilderProps {
  workoutData: LadderWorkoutData;
  onChange: (data: LadderWorkoutData) => void;
}

const LadderBuilder = ({ workoutData, onChange }: LadderBuilderProps) => {
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const { data: availableExercises } = useExercises();

  const updateLadderType = (ladderType: 'ascending' | 'descending' | 'pyramid') => {
    onChange({
      ...workoutData,
      ladderType,
      exercises: workoutData.exercises.map(ex => ({ ...ex, ladderType }))
    });
  };

  const addExercise = (exercise: Exercise) => {
    const newExercise: LadderExercise = {
      exerciseId: exercise.id,
      orderInWorkout: workoutData.exercises.length + 1,
      ladderPosition: workoutData.exercises.length + 1,
      ladderType: workoutData.ladderType,
      startReps: 1,
      endReps: 10,
      increment: 1,
      name: exercise.name,
      weightDescription: "bodyweight"
    };

    onChange({
      ...workoutData,
      exercises: [...workoutData.exercises, newExercise]
    });
  };

  const updateExercise = (exerciseIndex: number, updates: Partial<LadderExercise>) => {
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
      .map((ex, index) => ({ 
        ...ex, 
        ladderPosition: index + 1,
        orderInWorkout: index + 1 
      }));
    
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
      ladderPosition: index + 1,
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

  const generateLadderSequence = (exercise: LadderExercise): number[] => {
    const sequence: number[] = [];
    const { startReps, endReps, increment, ladderType } = exercise;
    
    if (ladderType === 'ascending') {
      for (let i = startReps; i <= endReps; i += increment) {
        sequence.push(i);
      }
    } else if (ladderType === 'descending') {
      for (let i = startReps; i >= endReps; i -= increment) {
        sequence.push(i);
      }
    } else if (ladderType === 'pyramid') {
      // Go up then down
      for (let i = startReps; i <= endReps; i += increment) {
        sequence.push(i);
      }
      // Go back down (excluding the peak)
      for (let i = endReps - increment; i >= startReps; i -= increment) {
        sequence.push(i);
      }
    }
    
    return sequence;
  };

  const calculateTotalReps = (exercise: LadderExercise): number => {
    const sequence = generateLadderSequence(exercise);
    return sequence.reduce((sum, reps) => sum + reps, 0);
  };

  const calculateWorkoutTotalReps = (): number => {
    return workoutData.exercises.reduce((total, exercise) => total + calculateTotalReps(exercise), 0);
  };

  const getEstimatedTime = (): number => {
    // Rough estimate: 2.5 seconds per rep + 10s transition between sets
    const totalReps = calculateWorkoutTotalReps();
    const totalSets = workoutData.exercises.reduce((total, exercise) => 
      total + generateLadderSequence(exercise).length, 0
    );
    const estimatedSeconds = (totalReps * 2.5) + (totalSets * 10);
    return Math.ceil(estimatedSeconds / 60);
  };

  const ladderPresets = [
    { label: "Classic 1-10", startReps: 1, endReps: 10, increment: 1 },
    { label: "Death by 1-21", startReps: 1, endReps: 21, increment: 1 },
    { label: "Even Numbers 2-20", startReps: 2, endReps: 20, increment: 2 },
    { label: "High Volume 5-50", startReps: 5, endReps: 50, increment: 5 }
  ];

  const applyPresetToAll = (preset: typeof ladderPresets[0]) => {
    const updatedExercises = workoutData.exercises.map(ex => ({
      ...ex,
      startReps: preset.startReps,
      endReps: preset.endReps,
      increment: preset.increment
    }));
    
    onChange({
      ...workoutData,
      exercises: updatedExercises
    });
  };

  return (
    <div className="space-y-6">
      {/* Ladder Settings */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <div className="flex items-center mb-4">
          <FaChartLine className="text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-purple-800">Ladder Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-purple-700 mb-2">
              Ladder Type
            </label>
            <select
              value={workoutData.ladderType}
              onChange={(e) => updateLadderType(e.target.value as 'ascending' | 'descending' | 'pyramid')}
              className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="ascending">Ascending (1, 2, 3, 4...)</option>
              <option value="descending">Descending (10, 9, 8, 7...)</option>
              <option value="pyramid">Pyramid (1, 2, 3, 4, 3, 2, 1)</option>
            </select>
          </div>
          
          {workoutData.exercises.length > 0 && (
            <>
              <div className="flex items-end">
                <div className="text-sm text-purple-600">
                  <div className="font-medium">Total Reps</div>
                  <div className="text-lg font-bold">{calculateWorkoutTotalReps()}</div>
                </div>
              </div>

              <div className="flex items-end">
                <div className="text-sm text-purple-600">
                  <div className="font-medium">Est. Time</div>
                  <div className="text-lg font-bold">~{getEstimatedTime()} min</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Preset Patterns */}
        {workoutData.exercises.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-purple-700 mb-2">
              Apply Preset Pattern to All Exercises
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {ladderPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyPresetToAll(preset)}
                  className="p-2 text-xs bg-white border border-purple-200 rounded hover:bg-purple-50 hover:border-purple-300 transition-colors"
                >
                  <div className="font-medium">{preset.label}</div>
                  <div className="text-purple-600">{preset.startReps}-{preset.endReps} by {preset.increment}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Explanation */}
        <div className="p-3 bg-purple-100 rounded-lg">
          <p className="text-sm text-purple-700">
            <FaSort className="inline mr-1" />
            <strong>Ladder Workout:</strong> Rep schemes that follow a progression pattern. 
            {workoutData.ladderType === 'ascending' && ' Start low and work your way up.'}
            {workoutData.ladderType === 'descending' && ' Start high and work your way down.'}
            {workoutData.ladderType === 'pyramid' && ' Go up to a peak, then back down.'}
          </p>
        </div>
      </div>

      {/* Exercise Configuration */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-800">Ladder Exercises</h4>
          <button
            onClick={() => setShowExercisePicker(true)}
            className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <FaPlus className="mr-2" />
            Add Exercise
          </button>
        </div>

        {workoutData.exercises.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <FaChartLine className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">Design Your Ladder</h4>
            <p className="text-gray-500 mb-4">
              Add exercises to create progressive rep schemes
            </p>
            <button
              onClick={() => setShowExercisePicker(true)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Add First Exercise
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {workoutData.exercises.map((exercise, index) => (
                <motion.div
                  key={exercise.exerciseId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Position and Move Controls */}
                    <div className="flex flex-col items-center space-y-1">
                      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {exercise.ladderPosition}
                      </div>
                      
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => moveExercise(index, Math.max(0, index - 1))}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-purple-500 disabled:opacity-30 transition-colors"
                          title="Move up"
                        >
                          <FaArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => moveExercise(index, Math.min(workoutData.exercises.length - 1, index + 1))}
                          disabled={index === workoutData.exercises.length - 1}
                          className="p-1 text-gray-400 hover:text-purple-500 disabled:opacity-30 transition-colors"
                          title="Move down"
                        >
                          <FaArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Exercise Details */}
                    <div className="flex-1 space-y-4">
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

                      {/* Ladder Configuration */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Start Reps
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={exercise.startReps}
                            onChange={(e) => updateExercise(index, { startReps: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            End Reps
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={exercise.endReps}
                            onChange={(e) => updateExercise(index, { endReps: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Increment
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={exercise.increment}
                            onChange={(e) => updateExercise(index, { increment: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Total Reps
                          </label>
                          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600 font-medium">
                            {calculateTotalReps(exercise)}
                          </div>
                        </div>
                      </div>

                      {/* Exercise Parameters */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Weight/Load
                          </label>
                          <input
                            type="text"
                            value={exercise.weightDescription || ''}
                            onChange={(e) => updateExercise(index, { weightDescription: e.target.value })}
                            placeholder="bodyweight, 135lb, etc."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                            placeholder="Rest between sets, scaling options..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>

                      {/* Ladder Preview */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Ladder Sequence:</strong>
                        </div>
                        <div className="flex flex-wrap gap-1 text-sm">
                          {generateLadderSequence(exercise).map((reps, idx) => (
                            <span 
                              key={idx} 
                              className="px-2 py-1 bg-purple-100 text-purple-700 rounded font-medium"
                            >
                              {reps}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {generateLadderSequence(exercise).length} sets • {calculateTotalReps(exercise)} total reps
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
              <div>Workout Type: <span className="font-medium">Ladder ({workoutData.ladderType})</span></div>
              <div>Total Exercises: <span className="font-medium">{workoutData.exercises.length}</span></div>
              <div>Total Sets: <span className="font-medium">
                {workoutData.exercises.reduce((total, exercise) => 
                  total + generateLadderSequence(exercise).length, 0
                )}
              </span></div>
            </div>
            <div className="space-y-1">
              <div>Total Reps: <span className="font-medium">{calculateWorkoutTotalReps()}</span></div>
              <div>Estimated Time: <span className="font-medium">~{getEstimatedTime()} minutes</span></div>
            </div>
          </div>
          
          {/* Exercise Breakdown */}
          <div className="mt-4 p-3 bg-white rounded-lg border">
            <h5 className="font-medium text-gray-800 mb-2">Exercise Breakdown:</h5>
            <div className="space-y-2 text-sm">
              {workoutData.exercises.map((exercise, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium">{exercise.ladderPosition}. {exercise.name}</span>
                  <span className="text-gray-600 text-xs">
                    {exercise.startReps}-{exercise.endReps} by {exercise.increment} 
                    ({calculateTotalReps(exercise)} total reps)
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

export default LadderBuilder;