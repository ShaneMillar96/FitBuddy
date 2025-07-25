import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaClock, 
  FaStar, 
  FaUser, 
  FaHeart, 
  FaShare, 
  FaDumbbell,
  FaUsers,
  FaComments,
  FaCalendarAlt,
  FaSpinner
} from "react-icons/fa";
import { CROSSFIT_CATEGORY_ID } from "@/interfaces/categories";
import { Workout } from "@/interfaces/workout";
import { useWorkoutFavorite } from "../../hooks/useFavorites";

interface EnhancedWorkoutCardProps {
  workout: Workout;
  viewMode?: 'grid' | 'list';
  onPreview?: (workout: Workout) => void;
  onShare?: (workout: Workout) => void;
}

const EnhancedWorkoutCard = ({
  workout,
  viewMode = 'grid',
  onPreview,
  onShare
}: EnhancedWorkoutCardProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  // Use the custom hook for favorites functionality
  const { 
    isFavorited, 
    totalFavorites, 
    isLoading: favoritesLoading, 
    isToggling, 
    toggleFavorite,
    error: favoriteError 
  } = useWorkoutFavorite(workout.id);

  const getCategoryName = (categoryId: number): string => {
    // Since we're CrossFit only, always return CrossFit WOD
    return 'CrossFit WOD';
  };


  const getCategoryGradient = (categoryId?: number): string => {
    // Since we're CrossFit only, always return the CrossFit gradient
    return 'from-red-500 to-orange-500';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on action buttons
    if ((e.target as HTMLElement).closest('.action-button')) {
      return;
    }
    onPreview?.(workout);
  };


  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleFavorite();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      // You could add a toast notification here
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(workout);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.01 }}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 group"
      >
        <div className="flex items-center space-x-4">
          {/* Category Icon */}
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getCategoryGradient(workout.categoryId)} flex items-center justify-center text-white text-xl`}>
            🔥
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-teal-600 transition-colors">
                  {workout.name}
                </h3>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-sm text-gray-600">
                    {getCategoryName(workout.categoryId)}
                    {workout.subTypeName && ` • ${workout.subTypeName}`}
                  </span>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center space-x-4 ml-4">
                {workout.estimatedDurationMinutes && (
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <FaClock className="text-xs" />
                    <span>{workout.estimatedDurationMinutes}min</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <FaUsers className="text-xs" />
                  <span>{(workout as any).resultsLogged || 0}</span>
                </div>

                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <FaComments className="text-xs" />
                  <span>{(workout as any).commentsCount || 0}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleFavorite}
                    disabled={isToggling}
                    className={`action-button p-2 rounded-lg transition-colors ${
                      isFavorited 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    } ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={`${isFavorited ? 'Remove from' : 'Add to'} favorites${totalFavorites > 0 ? ` (${totalFavorites})` : ''}`}
                  >
                    {isToggling ? (
                      <FaSpinner className="text-sm animate-spin" />
                    ) : (
                      <FaHeart className="text-sm" />
                    )}
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="action-button p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <FaShare className="text-sm text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 group overflow-hidden"
    >
      {/* Category Gradient Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getCategoryGradient(workout.categoryId)}`} />
      
      {/* Quick Actions Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute top-4 right-4 flex space-x-2 z-10"
      >
        <button
          onClick={handleFavorite}
          disabled={isToggling}
          className={`action-button p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 ${
            isFavorited 
              ? 'bg-red-500 text-white' 
              : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
          } ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={`${isFavorited ? 'Remove from' : 'Add to'} favorites${totalFavorites > 0 ? ` (${totalFavorites})` : ''}`}
        >
          {isToggling ? (
            <FaSpinner className="text-sm animate-spin" />
          ) : (
            <FaHeart className="text-sm" />
          )}
        </button>
        
        <button
          onClick={handleShare}
          className="action-button p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-500"
          title="Share workout"
        >
          <FaShare className="text-sm text-gray-600" />
        </button>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryGradient(workout.categoryId)} flex items-center justify-center text-white text-xl shadow-md`}>
              🔥
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 truncate group-hover:text-teal-600 transition-colors">
                {workout.name}
              </h2>
              {workout.categoryId && (
                <p className="text-sm text-gray-600 mt-1">
                  {getCategoryName(workout.categoryId)}
                  {workout.subTypeName && (
                    <span className="text-teal-600 font-medium"> • {workout.subTypeName}</span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* CrossFit WOD Info */}
        <p className="text-gray-700 text-sm mb-4">
          CrossFit WOD {workout.subTypeName && `• ${workout.subTypeName}`}
        </p>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Duration */}
          {workout.estimatedDurationMinutes && (
            <div className="flex items-center space-x-2">
              <FaClock className="text-blue-500 text-sm" />
              <span className="text-sm text-gray-700 font-medium">
                {workout.estimatedDurationMinutes} min
              </span>
            </div>
          )}

          {/* Exercise Count */}
          {workout.exercises && workout.exercises.length > 0 && (
            <div className="flex items-center space-x-2">
              <FaDumbbell className="text-purple-500 text-sm" />
              <span className="text-sm text-gray-700">
                {workout.exercises.length} exercises
              </span>
            </div>
          )}

          {/* Creator */}
          <div className="flex items-center space-x-2">
            <FaUser className="text-green-500 text-sm" />
            <span className="text-sm text-gray-700 truncate">
              {(workout.createdBy as any)?.username || workout.createdBy || 'Unknown'}
            </span>
          </div>
        </div>

        {/* Exercise Tags */}
        {workout.exercises && workout.exercises.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {workout.exercises.slice(0, 3).map((exercise, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {exercise.name}
              </span>
            ))}
            {workout.exercises.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{workout.exercises.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <FaUsers className="text-xs" />
              <span>{(workout as any).resultsLogged || 0} completed</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaComments className="text-xs" />
              <span>{(workout as any).commentsCount || 0} comments</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <FaCalendarAlt className="text-xs" />
            <span>{formatDate(workout.createdDate)}</span>
          </div>
        </div>
      </div>

      {/* Hover Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.03 : 0 }}
        className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(workout.categoryId)} rounded-2xl`}
      />
    </motion.div>
  );
};

export default EnhancedWorkoutCard;