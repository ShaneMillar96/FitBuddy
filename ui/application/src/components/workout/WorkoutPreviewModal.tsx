import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaTimes, 
  FaClock, 
  FaStar, 
  FaUser, 
  FaDumbbell,
  FaPlay,
  FaHeart,
  FaShare,
  FaList,
  FaChevronRight,
  FaSpinner
} from "react-icons/fa";
import { CATEGORY_ICONS, WORKOUT_CATEGORIES } from "@/interfaces/categories";
import { Workout } from "@/interfaces/workout";
import { useExercisesByCategory } from "@/hooks/useExercises";
import { useWorkoutFavorite } from "../../hooks/useFavorites";

interface WorkoutPreviewModalProps {
  workout: Workout | null;
  isOpen: boolean;
  onClose: () => void;
  onShare?: (workout: Workout) => void;
}

const WorkoutPreviewModal = ({
  workout,
  isOpen,
  onClose,
  onShare
}: WorkoutPreviewModalProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'exercises'>('overview');
  
  // Use the custom hook for favorites functionality
  const { 
    isFavorited, 
    totalFavorites, 
    isLoading: favoritesLoading, 
    isToggling, 
    toggleFavorite,
    error: favoriteError 
  } = useWorkoutFavorite(workout?.id || 0);
  
  // Mock exercise data - in a real app, you'd fetch the actual workout exercises
  const { data: categoryExercises } = useExercisesByCategory(workout?.categoryId || 0);
  const mockExercises = categoryExercises?.slice(0, 5) || [];

  if (!workout) return null;

  const getCategoryName = (categoryId: number): string => {
    const categoryNames = {
      [WORKOUT_CATEGORIES.WEIGHT_SESSION]: 'Weight Session',
      [WORKOUT_CATEGORIES.CROSSFIT_WOD]: 'CrossFit WOD',
      [WORKOUT_CATEGORIES.RUNNING_INTERVALS]: 'Running Intervals',
      [WORKOUT_CATEGORIES.SWIMMING]: 'Swimming',
      [WORKOUT_CATEGORIES.HYROX]: 'Hyrox',
      [WORKOUT_CATEGORIES.STRETCHING]: 'Stretching'
    };
    return categoryNames[categoryId as keyof typeof categoryNames] || 'Unknown';
  };

  const getDifficultyDisplay = (level?: number): string => {
    if (!level) return '';
    const difficultyNames = {
      1: 'Beginner',
      2: 'Easy', 
      3: 'Moderate',
      4: 'Hard',
      5: 'Expert'
    };
    return difficultyNames[level as keyof typeof difficultyNames] || '';
  };

  const getDifficultyColor = (level?: number): string => {
    if (!level) return 'text-gray-400';
    const colors = {
      1: 'text-green-500',
      2: 'text-green-400',
      3: 'text-yellow-500',
      4: 'text-orange-500',
      5: 'text-red-500'
    };
    return colors[level as keyof typeof colors] || 'text-gray-400';
  };

  const getCategoryGradient = (categoryId?: number): string => {
    if (!categoryId) return 'from-gray-400 to-gray-500';
    const gradients = {
      [WORKOUT_CATEGORIES.WEIGHT_SESSION]: 'from-blue-500 to-purple-600',
      [WORKOUT_CATEGORIES.CROSSFIT_WOD]: 'from-red-500 to-orange-500',
      [WORKOUT_CATEGORIES.RUNNING_INTERVALS]: 'from-green-500 to-teal-500',
      [WORKOUT_CATEGORIES.SWIMMING]: 'from-cyan-500 to-blue-500',
      [WORKOUT_CATEGORIES.HYROX]: 'from-yellow-500 to-orange-500',
      [WORKOUT_CATEGORIES.STRETCHING]: 'from-purple-500 to-pink-500'
    };
    return gradients[categoryId as keyof typeof gradients] || 'from-gray-400 to-gray-500';
  };

  const handleStartWorkout = () => {
    navigate(`/workouts/${workout.id}/session`);
    onClose();
  };

  const handleFavorite = async () => {
    try {
      await toggleFavorite();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      // You could add a toast notification here
    }
  };

  const handleShare = () => {
    onShare?.(workout);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`relative bg-gradient-to-br ${getCategoryGradient(workout.categoryId)} text-white p-6`}>
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
              >
                <FaTimes className="text-white" />
              </button>

              {/* Workout Header Info */}
              <div className="flex items-start space-x-4">
                {workout.categoryId && (
                  <div className="w-16 h-16 rounded-2xl bg-white bg-opacity-20 flex items-center justify-center text-2xl">
                    {CATEGORY_ICONS[workout.categoryId as keyof typeof CATEGORY_ICONS]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold mb-2">{workout.name}</h1>
                  <div className="flex items-center space-x-4 text-white text-opacity-90">
                    {workout.categoryId && (
                      <span className="text-sm">
                        {getCategoryName(workout.categoryId)}
                        {workout.subTypeName && ` • ${workout.subTypeName}`}
                      </span>
                    )}
                    {workout.difficultyLevel && (
                      <div className="flex items-center space-x-1">
                        <FaStar className="text-xs" />
                        <span className="text-sm">{getDifficultyDisplay(workout.difficultyLevel)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-white border-opacity-20">
                {workout.estimatedDurationMinutes && (
                  <div className="flex items-center space-x-2">
                    <FaClock className="text-sm" />
                    <span className="text-sm">{workout.estimatedDurationMinutes} minutes</span>
                  </div>
                )}
                {workout.equipmentNeeded && workout.equipmentNeeded.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <FaDumbbell className="text-sm" />
                    <span className="text-sm">{workout.equipmentNeeded.length} equipment</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <FaUser className="text-sm" />
                  <span className="text-sm">
                    {(workout.createdBy as any)?.username || workout.createdBy || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'text-teal-600 border-b-2 border-teal-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('exercises')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'exercises'
                    ? 'text-teal-600 border-b-2 border-teal-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Exercises Preview
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{workout.description}</p>
                  </div>

                  {/* Equipment Needed */}
                  {workout.equipmentNeeded && workout.equipmentNeeded.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Equipment Needed</h3>
                      <div className="flex flex-wrap gap-2">
                        {workout.equipmentNeeded.map((equipment, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                          >
                            {equipment}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Workout Stats */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Workout Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-gray-900">
                          {(workout as any).resultsLogged || 0}
                        </div>
                        <div className="text-sm text-gray-600">Times Completed</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-gray-900">
                          {(workout as any).commentsCount || 0}
                        </div>
                        <div className="text-sm text-gray-600">Comments</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'exercises' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Exercise Preview</h3>
                    <span className="text-sm text-gray-500">
                      {mockExercises.length} exercises (sample)
                    </span>
                  </div>
                  
                  {mockExercises.length > 0 ? (
                    <div className="space-y-3">
                      {mockExercises.map((exercise, index) => (
                        <div
                          key={exercise.id}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{exercise.name}</div>
                            <div className="text-sm text-gray-600">
                              {exercise.muscleGroups.join(', ')}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                            {exercise.exerciseType}
                          </div>
                        </div>
                      ))}
                      
                      <div className="text-center py-4">
                        <button
                          onClick={handleStartWorkout}
                          className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center justify-center space-x-1"
                        >
                          <span>View full workout</span>
                          <FaChevronRight className="text-xs" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FaList className="mx-auto text-2xl mb-2" />
                      <p>Exercise details will be shown here</p>
                      <button
                        onClick={handleStartWorkout}
                        className="mt-2 text-teal-600 hover:text-teal-700 font-medium"
                      >
                        View full workout details
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  onClick={handleFavorite}
                  disabled={isToggling}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isFavorited
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  } ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={`${isFavorited ? 'Remove from' : 'Add to'} favorites${totalFavorites > 0 ? ` (${totalFavorites})` : ''}`}
                >
                  {isToggling ? (
                    <FaSpinner className="text-sm animate-spin" />
                  ) : (
                    <FaHeart className="text-sm" />
                  )}
                  <span className="text-sm font-medium">
                    {isFavorited ? 'Favorited' : 'Favorite'}
                  </span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors"
                >
                  <FaShare className="text-sm" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>

              <button
                onClick={handleStartWorkout}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FaPlay className="text-sm" />
                <span>Start Workout</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WorkoutPreviewModal;