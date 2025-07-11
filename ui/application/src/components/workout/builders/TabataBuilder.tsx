import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaFire, FaClock, FaPlay, FaPause, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { TabataExercise, TabataWorkoutData } from "@/interfaces/workout-types";
import { useExercises, Exercise } from "@/hooks/useExercises";
import ExercisePicker from "../ExercisePicker";

interface TabataBuilderProps {
  workoutData: TabataWorkoutData;
  onChange: (data: TabataWorkoutData) => void;
}

const TabataBuilder = ({ workoutData, onChange }: TabataBuilderProps) => {
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const { data: availableExercises } = useExercises();

  const updateTotalRounds = (rounds: number) => {
    const validRounds = Math.max(1, Math.min(32, rounds));
    onChange({
      ...workoutData,
      totalRounds: validRounds
    });
  };

  const addExercise = (exercise: Exercise) => {
    const newExercise: TabataExercise = {
      exerciseId: exercise.id,
      orderInWorkout: workoutData.exercises.length + 1,
      exercisePosition: workoutData.exercises.length + 1,
      workTimeSeconds: 20, // Classic Tabata timing
      restTimeSeconds: 10, // Classic Tabata timing
      rounds: 8, // Classic Tabata rounds
      name: exercise.name,
      weightDescription: "bodyweight"
    };

    onChange({
      ...workoutData,
      exercises: [...workoutData.exercises, newExercise]
    });
  };

  const updateExercise = (exerciseIndex: number, updates: Partial<TabataExercise>) => {
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
        exercisePosition: index + 1,
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
      exercisePosition: index + 1,
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

  const calculateTotalDuration = () => {
    if (workoutData.exercises.length === 0) return 0;
    
    // Calculate total time per exercise cycle
    const timePerExercise = workoutData.exercises.reduce((total, exercise) => {
      const cycleTime = (exercise.workTimeSeconds + exercise.restTimeSeconds) * exercise.rounds;
      return total + cycleTime;
    }, 0);
    
    // Convert to minutes
    return Math.ceil(timePerExercise / 60);
  };

  const getTotalIntervals = () => {
    return workoutData.exercises.reduce((total, exercise) => total + exercise.rounds, 0);
  };

  const presetTimings = [
    { label: "Classic Tabata", work: 20, rest: 10, rounds: 8 },
    { label: "Modified Tabata", work: 30, rest: 15, rounds: 6 },
    { label: "HIIT Protocol", work: 45, rest: 15, rounds: 4 },
    { label: "Sprint Intervals", work: 15, rest: 45, rounds: 6 }
  ];

  const applyPresetToAll = (preset: typeof presetTimings[0]) => {
    const updatedExercises = workoutData.exercises.map(ex => ({
      ...ex,
      workTimeSeconds: preset.work,
      restTimeSeconds: preset.rest,
      rounds: preset.rounds
    }));
    
    onChange({
      ...workoutData,
      exercises: updatedExercises
    });
  };

  return (
    <div className="space-y-6">
      {/* Tabata Settings */}
      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
        <div className="flex items-center mb-4">
          <FaFire className="text-red-600 mr-2" />
          <h3 className="text-lg font-semibold text-red-800">Tabata Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-red-700 mb-2">
              Total Protocol Rounds
            </label>
            <input
              type="number"
              min="1"
              max="32"
              value={workoutData.totalRounds}
              onChange={(e) => updateTotalRounds(Number(e.target.value))}
              className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          {workoutData.exercises.length > 0 && (
            <>
              <div className="flex items-end">
                <div className="text-sm text-red-600">
                  <div className="font-medium">Total Duration</div>
                  <div className="text-lg font-bold">~{calculateTotalDuration()} min</div>
                </div>
              </div>

              <div className="flex items-end">
                <div className="text-sm text-red-600">
                  <div className="font-medium">Total Intervals</div>
                  <div className="text-lg font-bold">{getTotalIntervals()}</div>
                </div>
              </div>

              <div className="flex items-end">
                <div className="text-sm text-red-600">
                  <div className="font-medium">Exercises</div>
                  <div className="text-lg font-bold">{workoutData.exercises.length}</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Preset Timings */}
        {workoutData.exercises.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-red-700 mb-2">
              Apply Preset Timing to All Exercises
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {presetTimings.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyPresetToAll(preset)}
                  className="p-2 text-xs bg-white border border-red-200 rounded hover:bg-red-50 hover:border-red-300 transition-colors"
                >
                  <div className="font-medium">{preset.label}</div>
                  <div className="text-red-600">{preset.work}s/{preset.rest}s × {preset.rounds}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Explanation */}
        <div className="p-3 bg-red-100 rounded-lg">
          <p className="text-sm text-red-700">
            <FaFire className="inline mr-1" />
            <strong>Tabata Protocol:</strong> High-intensity intervals with alternating work and rest periods. 
            Classic Tabata is 20 seconds all-out effort followed by 10 seconds rest for 8 rounds.
          </p>
        </div>
      </div>

      {/* Exercise Configuration */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-800">Exercise Intervals</h4>
          <button
            onClick={() => setShowExercisePicker(true)}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <FaPlus className="mr-2" />
            Add Exercise
          </button>
        </div>

        {workoutData.exercises.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <FaFire className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">Design Your Tabata</h4>
            <p className="text-gray-500 mb-4">
              Add exercises to create high-intensity interval training
            </p>
            <button
              onClick={() => setShowExercisePicker(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:border-red-300 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Position and Move Controls */}
                    <div className="flex flex-col items-center space-y-1">
                      <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {exercise.exercisePosition}
                      </div>
                      
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => moveExercise(index, Math.max(0, index - 1))}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                          title="Move up"
                        >
                          <FaArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => moveExercise(index, Math.min(workoutData.exercises.length - 1, index + 1))}
                          disabled={index === workoutData.exercises.length - 1}
                          className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-30 transition-colors"
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

                      {/* Timing Configuration */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            <FaPlay className="inline w-3 h-3 mr-1" />
                            Work Time (seconds)
                          </label>
                          <input
                            type="number"
                            min="5"
                            max="300"
                            value={exercise.workTimeSeconds}
                            onChange={(e) => updateExercise(index, { workTimeSeconds: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            <FaPause className="inline w-3 h-3 mr-1" />
                            Rest Time (seconds)
                          </label>
                          <input
                            type="number"
                            min="5"
                            max="300"
                            value={exercise.restTimeSeconds}
                            onChange={(e) => updateExercise(index, { restTimeSeconds: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            <FaClock className="inline w-3 h-3 mr-1" />
                            Rounds
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={exercise.rounds}
                            onChange={(e) => updateExercise(index, { rounds: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Duration
                          </label>
                          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600">
                            {Math.ceil(((exercise.workTimeSeconds + exercise.restTimeSeconds) * exercise.rounds) / 60)} min
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
                            placeholder="Max effort, specific form cues..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                      </div>

                      {/* Interval Preview */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">
                          <strong>Interval Structure:</strong> {exercise.workTimeSeconds}s work → {exercise.restTimeSeconds}s rest × {exercise.rounds} rounds
                          <br />
                          <strong>Total Time:</strong> {Math.ceil(((exercise.workTimeSeconds + exercise.restTimeSeconds) * exercise.rounds) / 60)} minutes
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
              <div>Workout Type: <span className="font-medium">Tabata Protocol</span></div>
              <div>Total Exercises: <span className="font-medium">{workoutData.exercises.length}</span></div>
              <div>Total Intervals: <span className="font-medium">{getTotalIntervals()}</span></div>
            </div>
            <div className="space-y-1">
              <div>Total Duration: <span className="font-medium">~{calculateTotalDuration()} minutes</span></div>
              <div>Protocol Rounds: <span className="font-medium">{workoutData.totalRounds}</span></div>
            </div>
          </div>
          
          {/* Exercise Breakdown */}
          <div className="mt-4 p-3 bg-white rounded-lg border">
            <h5 className="font-medium text-gray-800 mb-2">Exercise Sequence:</h5>
            <div className="space-y-2 text-sm">
              {workoutData.exercises.map((exercise, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium">{exercise.exercisePosition}. {exercise.name}</span>
                  <span className="text-gray-600 text-xs">
                    {exercise.workTimeSeconds}s work / {exercise.restTimeSeconds}s rest × {exercise.rounds} rounds
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

export default TabataBuilder;