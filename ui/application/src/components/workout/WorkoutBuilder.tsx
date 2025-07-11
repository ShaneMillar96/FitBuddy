import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaGripVertical, FaSearch, FaSpinner } from "react-icons/fa";
import { CreateWorkoutExercise } from "@/interfaces/categories";
import { useExercises, useSearchExercises, Exercise } from "@/hooks/useExercises";
import { 
  WORKOUT_TYPES, 
  WorkoutTypeId,
  EMOMWorkoutData,
  AMRAPWorkoutData,
  ForTimeWorkoutData,
  TabataWorkoutData,
  LadderWorkoutData,
  WorkoutTypeData
} from "@/interfaces/workout-types";
import EMOMBuilder from "./builders/EMOMBuilder";
import AMRAPBuilder from "./builders/AMRAPBuilder";
import ForTimeBuilder from "./builders/ForTimeBuilder";
import TabataBuilder from "./builders/TabataBuilder";
import LadderBuilder from "./builders/LadderBuilder";

interface WorkoutBuilderProps {
  exercises: CreateWorkoutExercise[];
  onExercisesChange: (exercises: CreateWorkoutExercise[]) => void;
  workoutTypeId?: WorkoutTypeId;
  onWorkoutTypeDataChange?: (data: WorkoutTypeData) => void;
  className?: string;
}

const WorkoutBuilder = ({
  exercises,
  onExercisesChange,
  workoutTypeId,
  onWorkoutTypeDataChange,
  className = ""
}: WorkoutBuilderProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  
  // Initialize workout type specific data
  const [workoutTypeData, setWorkoutTypeData] = useState<WorkoutTypeData>(() => {
    switch (workoutTypeId) {
      case WORKOUT_TYPES.EMOM:
        return { totalMinutes: 12, exercises: [] } as EMOMWorkoutData;
      case WORKOUT_TYPES.AMRAP:
        return { timeCapMinutes: 20, exercises: [] } as AMRAPWorkoutData;
      case WORKOUT_TYPES.FOR_TIME:
        return { totalRounds: 1, exercises: [] } as ForTimeWorkoutData;
      case WORKOUT_TYPES.TABATA:
        return { totalRounds: 1, exercises: [] } as TabataWorkoutData;
      case WORKOUT_TYPES.LADDER:
        return { ladderType: 'ascending', exercises: [] } as LadderWorkoutData;
      default:
        return { exercises: [] } as any;
    }
  });
  
  // Use database exercises
  const { data: allExercises, isLoading: exercisesLoading } = useExercises();
  const { data: searchResults, isLoading: searchLoading } = useSearchExercises(
    searchTerm,
    searchTerm.length >= 2
  );
  
  // Determine which exercises to show
  const availableExercises = searchTerm.length >= 2 ? searchResults : allExercises;

  // Handle workout type data changes
  const handleWorkoutTypeDataChange = (data: WorkoutTypeData) => {
    setWorkoutTypeData(data);
    onWorkoutTypeDataChange?.(data);
  };

  // Get default values for CrossFit exercises
  const getExerciseDefaults = (exercise: Exercise) => {
    const defaults: Partial<CreateWorkoutExercise> = {
      exerciseId: exercise.id,
      orderInWorkout: exercises.length + 1,
      sets: 1,
      reps: 10,
      restSeconds: 60,
    };

    return defaults;
  };

  const addExercise = (exercise: Exercise) => {
    const newExercise: CreateWorkoutExercise = {
      ...getExerciseDefaults(exercise)
    } as CreateWorkoutExercise;

    onExercisesChange([...exercises, newExercise]);
    setShowExercisePicker(false);
    setSearchTerm("");
  };

  const removeExercise = (index: number) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    // Reorder remaining exercises
    const reorderedExercises = newExercises.map((ex, i) => ({
      ...ex,
      orderInWorkout: i + 1
    }));
    onExercisesChange(reorderedExercises);
  };

  const updateExercise = (index: number, updates: Partial<CreateWorkoutExercise>) => {
    const newExercises = exercises.map((ex, i) => 
      i === index ? { ...ex, ...updates } : ex
    );
    onExercisesChange(newExercises);
  };

  const moveExercise = (fromIndex: number, toIndex: number) => {
    const newExercises = [...exercises];
    const [movedExercise] = newExercises.splice(fromIndex, 1);
    newExercises.splice(toIndex, 0, movedExercise);
    
    // Reorder all exercises
    const reorderedExercises = newExercises.map((ex, i) => ({
      ...ex,
      orderInWorkout: i + 1
    }));
    onExercisesChange(reorderedExercises);
  };

  const getExerciseById = (exerciseId: number): Exercise | undefined => {
    return availableExercises?.find(ex => ex.id === exerciseId);
  };

  // Show all relevant fields for workout exercises
  const getRelevantFields = () => {
    return ['sets', 'reps', 'time', 'rest', 'weight'];
  };

  // Render workout type specific builder or default builder
  const renderWorkoutBuilder = () => {
    if (!workoutTypeId) {
      // Render default/legacy builder for backward compatibility
      return renderDefaultBuilder();
    }

    switch (workoutTypeId) {
      case WORKOUT_TYPES.EMOM:
        return (
          <EMOMBuilder
            workoutData={workoutTypeData as EMOMWorkoutData}
            onChange={handleWorkoutTypeDataChange}
          />
        );
      case WORKOUT_TYPES.AMRAP:
        return (
          <AMRAPBuilder
            workoutData={workoutTypeData as AMRAPWorkoutData}
            onChange={handleWorkoutTypeDataChange}
          />
        );
      case WORKOUT_TYPES.FOR_TIME:
        return (
          <ForTimeBuilder
            workoutData={workoutTypeData as ForTimeWorkoutData}
            onChange={handleWorkoutTypeDataChange}
          />
        );
      case WORKOUT_TYPES.TABATA:
        return (
          <TabataBuilder
            workoutData={workoutTypeData as TabataWorkoutData}
            onChange={handleWorkoutTypeDataChange}
          />
        );
      case WORKOUT_TYPES.LADDER:
        return (
          <LadderBuilder
            workoutData={workoutTypeData as LadderWorkoutData}
            onChange={handleWorkoutTypeDataChange}
          />
        );
      default:
        return renderDefaultBuilder();
    }
  };

  const renderDefaultBuilder = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Workout Exercises</h3>
        <motion.button
          type="button"
          onClick={() => setShowExercisePicker(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus className="text-sm" />
          <span>Add Exercise</span>
        </motion.button>
      </div>

      {/* Exercise List */}
      <div className="space-y-3">
        <AnimatePresence>
          {exercises.map((exercise, index) => {
            const exerciseData = getExerciseById(exercise.exerciseId);
            
            return (
              <motion.div
                key={`${exercise.exerciseId}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-2">
                    <FaGripVertical className="text-gray-400 cursor-move" />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-800">
                        {exerciseData?.name || 'Unknown Exercise'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeExercise(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>

                    {/* Exercise Info */}
                    {exerciseData && exerciseData.description && (
                      <div className="mb-2">
                        <span className="text-xs text-gray-500">
                          {exerciseData.description}
                        </span>
                      </div>
                    )}

                    {/* CrossFit Exercise Parameters */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {getRelevantFields().includes('sets') && (
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Sets</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={exercise.sets || ''}
                            onChange={(e) => updateExercise(index, { sets: e.target.value ? parseInt(e.target.value) : undefined })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Sets"
                          />
                        </div>
                      )}

                      {getRelevantFields().includes('reps') && (
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Reps</label>
                          <input
                            type="number"
                            min="1"
                            value={exercise.reps || ''}
                            onChange={(e) => updateExercise(index, { reps: e.target.value ? parseInt(e.target.value) : undefined })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Reps"
                          />
                        </div>
                      )}

                      {getRelevantFields().includes('time') && (
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Time (sec)</label>
                          <input
                            type="number"
                            min="1"
                            value={exercise.timeSeconds || ''}
                            onChange={(e) => updateExercise(index, { timeSeconds: e.target.value ? parseInt(e.target.value) : undefined })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Time"
                          />
                        </div>
                      )}

                      {getRelevantFields().includes('rest') && (
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Rest (sec)</label>
                          <input
                            type="number"
                            min="0"
                            value={exercise.restSeconds || ''}
                            onChange={(e) => updateExercise(index, { restSeconds: e.target.value ? parseInt(e.target.value) : undefined })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Rest"
                          />
                        </div>
                      )}

                      {getRelevantFields().includes('weight') && (
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Weight</label>
                          <input
                            type="text"
                            value={exercise.weightDescription || ''}
                            onChange={(e) => updateExercise(index, { weightDescription: e.target.value || undefined })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="e.g., bodyweight, 50kg"
                          />
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Notes</label>
                      <input
                        type="text"
                        value={exercise.notes || ''}
                        onChange={(e) => updateExercise(index, { notes: e.target.value || undefined })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Exercise notes or modifications..."
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {exercises.length === 0 && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            <p>No exercises added yet. Click "Add Exercise" to start building your workout.</p>
          </div>
        )}
      </div>

    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {renderWorkoutBuilder()}
      
      {/* Exercise Picker Modal - shared by all workout types */}
      <AnimatePresence>
        {showExercisePicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowExercisePicker(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Choose Exercise</h3>
                <button
                  onClick={() => setShowExercisePicker(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search exercises..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Exercise List */}
              <div className="flex-1 overflow-y-auto space-y-2">
                {(exercisesLoading || (searchTerm.length >= 2 && searchLoading)) && (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                )}

                {!exercisesLoading && !searchLoading && availableExercises?.map((exercise) => (
                  <motion.button
                    key={exercise.id}
                    type="button"
                    onClick={() => addExercise(exercise)}
                    className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">{exercise.name}</h4>
                        {exercise.description && (
                          <div className="text-sm text-gray-600">
                            {exercise.description}
                          </div>
                        )}
                      </div>
                      <FaPlus className="text-teal-500" />
                    </div>
                  </motion.button>
                ))}

                {!exercisesLoading && !searchLoading && availableExercises?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No exercises found. Try adjusting your search.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkoutBuilder;