import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaTimes, 
  FaClock, 
  FaUser, 
  FaDumbbell,
  FaPlay,
  FaHeart,
  FaShare,
  FaSpinner
} from "react-icons/fa";
import { CATEGORY_ICONS } from "@/interfaces/categories";
import { Workout } from "@/interfaces/workout";
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
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard'>('overview');
  
  // Use the custom hook for favorites functionality
  const { 
    isFavorited, 
    totalFavorites, 
    isLoading: favoritesLoading, 
    isToggling, 
    toggleFavorite,
    error: favoriteError 
  } = useWorkoutFavorite(workout?.id || 0);
  
  // No longer needed since we removed exercises preview

  if (!workout) return null;

  const getCategoryName = (categoryId: number): string => {
    // Since we're CrossFit only, always return CrossFit WOD
    return 'CrossFit WOD';
  };


  const getCategoryGradient = (categoryId?: number): string => {
    // Since we're CrossFit only, always return the CrossFit gradient
    return 'from-red-500 to-orange-500';
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
                    {workout.estimatedDurationMinutes && (
                      <div className="flex items-center space-x-1">
                        <FaClock className="text-xs" />
                        <span className="text-sm">{workout.estimatedDurationMinutes} min</span>
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
                {workout.exercises && workout.exercises.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <FaDumbbell className="text-sm" />
                    <span className="text-sm">{workout.exercises.length} exercises</span>
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
                onClick={() => setActiveTab('leaderboard')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'leaderboard'
                    ? 'text-teal-600 border-b-2 border-teal-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Leaderboard
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">CrossFit WOD: {workout.name}</p>
                  </div>

                  {/* Equipment Needed */}
                  {workout.exercises && workout.exercises.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Exercises</h3>
                      <div className="flex flex-wrap gap-2">
                        {workout.exercises.map((exercise, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                          >
                            {exercise.name || `Exercise ${index + 1}`}
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

              {activeTab === 'leaderboard' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Leaderboard</h3>
                    <span className="text-sm text-gray-500">
                      Top performers
                    </span>
                  </div>
                  
                  {/* Leaderboard placeholder */}
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">🏆</div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Leaderboard Coming Soon</h4>
                    <p className="text-sm text-gray-600 mb-6">
                      See how you rank against other athletes who have completed this workout.
                    </p>
                    <button
                      onClick={handleStartWorkout}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-md flex items-center space-x-2 mx-auto"
                    >
                      <FaPlay className="text-sm" />
                      <span>Start Workout</span>
                    </button>
                  </div>
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