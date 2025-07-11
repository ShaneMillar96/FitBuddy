import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaPlus, FaTimes, FaSpinner } from "react-icons/fa";
import { Exercise } from "@/hooks/useExercises";
import { useSearchExercises } from "@/hooks/useExercises";

interface ExercisePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
  availableExercises: Exercise[];
}

const ExercisePicker = ({ isOpen, onClose, onSelect, availableExercises }: ExercisePickerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: searchResults, isLoading: searchLoading } = useSearchExercises(
    searchTerm,
    searchTerm.length >= 2
  );

  // Determine which exercises to show
  const exercisesToShow = searchTerm.length >= 2 ? searchResults : availableExercises;

  const handleSelect = (exercise: Exercise) => {
    onSelect(exercise);
    setSearchTerm(""); // Clear search when closing
  };

  const handleClose = () => {
    setSearchTerm(""); // Clear search when closing
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Choose Exercise</h3>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaTimes className="w-5 h-5" />
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Exercise List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {/* Loading State */}
            {searchLoading && searchTerm.length >= 2 && (
              <div className="flex items-center justify-center py-8">
                <FaSpinner className="animate-spin text-2xl text-blue-500 mr-3" />
                <span className="text-gray-600">Searching exercises...</span>
              </div>
            )}

            {/* Exercise Cards */}
            {!searchLoading && exercisesToShow?.map((exercise) => (
              <motion.button
                key={exercise.id}
                type="button"
                onClick={() => handleSelect(exercise)}
                className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 group-hover:text-blue-700 transition-colors">
                      {exercise.name}
                    </h4>
                    {exercise.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {exercise.description}
                      </p>
                    )}
                  </div>
                  <FaPlus className="text-blue-500 ml-3 group-hover:scale-110 transition-transform" />
                </div>
              </motion.button>
            ))}

            {/* No Results */}
            {!searchLoading && exercisesToShow?.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                  <FaSearch className="w-12 h-12 mx-auto mb-3" />
                </div>
                <h4 className="text-lg font-medium text-gray-600 mb-2">No exercises found</h4>
                <p className="text-gray-500">
                  {searchTerm.length >= 2 
                    ? "Try adjusting your search terms"
                    : "No exercises available"
                  }
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
            <span>{exercisesToShow?.length || 0} exercises available</span>
            <span>Click an exercise to add it to your workout</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExercisePicker;