import { useState, useEffect } from "react";
import { useWorkouts } from "@/hooks/useWorkouts";
import { motion } from "framer-motion";
import { Workout } from "@/interfaces/workout";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaSearch,
  FaTh,
  FaList
} from "react-icons/fa";

// Import our components
import EnhancedWorkoutCard from "@/components/workout/EnhancedWorkoutCard";
import WorkoutPreviewModal from "@/components/workout/WorkoutPreviewModal";

// Skeleton loader component for loading state
const SkeletonCard = ({ viewMode }: { viewMode?: 'grid' | 'list' }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-gray-100 animate-pulse rounded-xl p-4 h-20 shadow-sm flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="w-20 h-4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 animate-pulse rounded-2xl p-6 h-80 shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );
};

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const WorkoutList = () => {
  const navigate = useNavigate();
  
  // Simplified state management - no filters needed
  const [searchInput, setSearchInput] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState("newest");
  const [previewWorkout, setPreviewWorkout] = useState<Workout | null>(null);
  
  // Debounce the search input
  const debouncedSearch = useDebounce(searchInput, 500);

  // Simplified query parameters - only basic search and sort
  const getQueryParams = () => ({
    search: debouncedSearch,
    sortBy,
    sortDirection: sortBy.includes('desc') ? 'desc' : 'asc'
  });

  // Fetch workouts with simplified parameters
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useWorkouts({
    pageSize: 12,
    ...getQueryParams()
  });

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'alphabetical', label: 'A to Z' },
  ];

  // Loading State with Skeleton Cards
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-xl w-full mb-6 animate-pulse"></div>
          </div>

          {/* Content Skeleton */}
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {[...Array(8)].map((_, idx) => (
              <SkeletonCard key={idx} viewMode={viewMode} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">We couldn't load your workouts. Please try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-300"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  const workouts = data?.pages.flatMap((page) => (page as any)?.data) || [];

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handlePreview = (workout: Workout) => {
    setPreviewWorkout(workout);
  };

  const handleShare = (workout: Workout) => {
    if (navigator.share) {
      navigator.share({
        title: workout.name,
        text: `CrossFit WOD: ${workout.name}`,
        url: `${window.location.origin}/workouts/${workout.id}`
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/workouts/${workout.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto p-6 lg:p-8">
        {/* Simplified Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                CrossFit Workouts 🔥
              </h1>
              <p className="text-gray-600 mt-2">
                Discover and track your CrossFit WODs
              </p>
            </div>
            <button
              onClick={() => navigate('/create-workout')}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
            >
              <FaPlus />
              <span>Create WOD</span>
            </button>
          </div>

          {/* Search and Controls Bar */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search CrossFit workouts..."
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-white text-red-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FaTh />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-white text-red-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FaList />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {workouts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-6">🏋️‍♂️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {debouncedSearch 
                ? "No workouts match your search"
                : "No workouts yet"}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {debouncedSearch
                ? "Try a different search term to find CrossFit workouts."
                : "Ready to start your CrossFit journey? Create your first WOD!"}
            </p>
            <button
              onClick={() => {
                if (debouncedSearch) {
                  setSearchInput("");
                } else {
                  navigate('/create-workout');
                }
              }}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {debouncedSearch ? "Clear Search" : "Create Your First WOD"}
            </button>
          </motion.div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {workouts.length} CrossFit workouts
              </p>
              {debouncedSearch && (
                <button
                  onClick={() => setSearchInput("")}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>

            {/* Workout Grid/List */}
            <motion.div
              className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "space-y-4"
              }
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 },
                },
              }}
            >
              {workouts.map((workout) => (
                <motion.div
                  key={workout.id}
                  variants={{ 
                    hidden: { opacity: 0, y: 20 }, 
                    visible: { opacity: 1, y: 0 } 
                  }}
                >
                  <EnhancedWorkoutCard
                    workout={workout}
                    viewMode={viewMode}
                    onPreview={handlePreview}
                    onShare={handleShare}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Load More Button */}
            {hasNextPage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 text-center"
              >
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-8 py-4 bg-white border-2 border-red-500 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {isFetchingNextPage ? (
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full"></div>
                      <span>Loading more workouts...</span>
                    </div>
                  ) : (
                    "Load More Workouts"
                  )}
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Workout Preview Modal */}
      <WorkoutPreviewModal
        workout={previewWorkout}
        isOpen={!!previewWorkout}
        onClose={() => setPreviewWorkout(null)}
        onShare={handleShare}
      />
    </div>
  );
};

export default WorkoutList;