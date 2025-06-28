import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaGripVertical, FaSearch } from "react-icons/fa";
import { useExercisesByCategory, useSearchExercises } from "@/hooks/useExercises";
import { Exercise, CreateWorkoutExercise } from "@/interfaces/categories";

interface WorkoutBuilderProps {
  categoryId?: number;
  exercises: CreateWorkoutExercise[];
  onExercisesChange: (exercises: CreateWorkoutExercise[]) => void;
  className?: string;
}

const WorkoutBuilder = ({
  categoryId,
  exercises,
  onExercisesChange,
  className = ""
}: WorkoutBuilderProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  
  const { data: categoryExercises, isLoading: categoryLoading } = useExercisesByCategory(categoryId || 0);
  const { data: searchResults, isLoading: searchLoading } = useSearchExercises(searchTerm, categoryId);

  const availableExercises = searchTerm.length >= 2 ? searchResults : categoryExercises;

  const addExercise = (exercise: Exercise) => {
    const newExercise: CreateWorkoutExercise = {
      exerciseId: exercise.id,
      orderInWorkout: exercises.length + 1,
      sets: exercise.categoryId === 1 ? 3 : undefined, // Default sets for weight training
      reps: exercise.categoryId === 1 ? 10 : undefined, // Default reps for weight training
    };

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

  if (!categoryId) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <p>Please select a workout category first to build your workout.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
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

                    {/* Exercise Parameters */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {/* Sets */}
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

                      {/* Reps */}
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

                      {/* Weight */}
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={exercise.weightKg || ''}
                          onChange={(e) => updateExercise(index, { weightKg: e.target.value ? parseFloat(e.target.value) : undefined })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Weight"
                        />
                      </div>

                      {/* Rest */}
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

      {/* Exercise Picker Modal */}
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
                {(categoryLoading || searchLoading) && (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                )}

                {availableExercises?.map((exercise) => (
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
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{exercise.muscleGroups.join(', ')}</span>
                          {exercise.difficultyLevel && (
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                              Level {exercise.difficultyLevel}
                            </span>
                          )}
                        </div>
                      </div>
                      <FaPlus className="text-teal-500" />
                    </div>
                  </motion.button>
                ))}

                {availableExercises?.length === 0 && !categoryLoading && !searchLoading && (
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