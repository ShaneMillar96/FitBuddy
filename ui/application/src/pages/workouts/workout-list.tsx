import { useState, useEffect } from "react";
import { useWorkouts } from "@/hooks/useWorkouts";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORY_ICONS, WORKOUT_CATEGORIES } from "@/interfaces/categories";
import { Workout } from "@/interfaces/workout";

// Import our new components
import WorkoutListHeader from "@/components/workout/WorkoutListHeader";
import WorkoutFilterPanel from "@/components/workout/WorkoutFilterPanel";
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
  // State management
  const [searchInput, setSearchInput] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [previewWorkout, setPreviewWorkout] = useState<Workout | null>(null);
  
  // Advanced filter state
  const [filters, setFilters] = useState({
    categories: [] as number[],
    subTypes: [] as number[],
    difficulty: [1, 5] as [number, number],
    duration: [0, 120] as [number, number],
    equipment: [] as string[],
    creator: ''
  });

  // Debounce the search input
  const debouncedSearch = useDebounce(searchInput, 500);

  // Build query parameters from filters
  const getQueryParams = () => {
    const params: any = {
      search: debouncedSearch,
      sortBy,
      sortDirection: sortBy.includes('desc') ? 'desc' : 'asc'
    };

    if (filters.categories.length > 0) {
      params.categoryId = filters.categories[0]; // Use first category for now
    }

    if (filters.difficulty[0] > 1 || filters.difficulty[1] < 5) {
      params.difficultyLevel = filters.difficulty[0];
    }

    return params;
  };

  // Fetch workouts with current filters
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useWorkouts({
    pageSize: 12,
    ...getQueryParams()
  });

  // Loading State with Skeleton Cards
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-xl w-full mb-6 animate-pulse"></div>
            <div className="flex space-x-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="flex gap-6">
            {/* Sidebar Skeleton */}
            <div className="hidden lg:block w-80">
              <div className="bg-gray-100 rounded-xl p-6 h-96 animate-pulse"></div>
            </div>

            {/* Main Content Skeleton */}
            <div className="flex-1">
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {[...Array(6)].map((_, idx) => (
                  <SkeletonCard key={idx} viewMode={viewMode} />
                ))}
              </div>
            </div>
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
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-blue-600 transition-all duration-300"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  const workouts = data?.pages.flatMap((page) => (page as any)?.data) || [];

  // Filter workouts client-side for additional criteria
  const filteredWorkouts = workouts.filter(workout => {
    // Equipment filter
    if (filters.equipment.length > 0) {
      const hasRequiredEquipment = filters.equipment.some(equipment => 
        workout.equipmentNeeded?.includes(equipment)
      );
      if (!hasRequiredEquipment) return false;
    }

    // Duration filter
    if (workout.estimatedDurationMinutes) {
      const duration = workout.estimatedDurationMinutes;
      if (duration < filters.duration[0] || duration > filters.duration[1]) {
        return false;
      }
    }

    // Difficulty filter (more precise client-side filtering)
    if (workout.difficultyLevel) {
      if (workout.difficultyLevel < filters.difficulty[0] || workout.difficultyLevel > filters.difficulty[1]) {
        return false;
      }
    }

    // Creator filter
    if (filters.creator === 'me') {
      // In a real app, you'd check against current user
      return (workout.createdBy as any)?.username === 'ShaneMillar';
    }

    return true;
  });

  // Event handlers
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      subTypes: [],
      difficulty: [1, 5],
      duration: [0, 120],
      equipment: [],
      creator: ''
    });
  };

  const handlePreview = (workout: Workout) => {
    setPreviewWorkout(workout);
  };


  const handleShare = (workout: Workout) => {
    if (navigator.share) {
      navigator.share({
        title: workout.name,
        text: workout.description,
        url: `${window.location.origin}/workouts/${workout.id}`
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/workouts/${workout.id}`);
      // You could show a toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Enhanced Header */}
        <WorkoutListHeader
          searchInput={searchInput}
          onSearchChange={handleSearchChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          activeFilters={filters}
          onClearFilters={handleClearFilters}
          totalWorkouts={workouts.length}
        />

        {/* Main Content Area */}
        <div className="flex gap-6">
          {/* Filter Sidebar - Desktop */}
          <div className="hidden lg:block w-80">
            <div className="sticky top-6">
              {/* Filters */}
              <WorkoutFilterPanel
                isOpen={true}
                onClose={() => {}}
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </div>

          {/* Main Workout List */}
          <div className="flex-1">
            {/* Empty State */}
            {filteredWorkouts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-6">🏋️‍♂️</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {debouncedSearch || filters.categories.length > 0 || filters.equipment.length > 0
                    ? "No workouts match your criteria"
                    : "No workouts yet"}
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {debouncedSearch || filters.categories.length > 0 || filters.equipment.length > 0
                    ? "Try adjusting your filters or search terms to find what you're looking for."
                    : "Ready to start your fitness journey? Create your first workout and begin building your routine!"}
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {debouncedSearch || filters.categories.length > 0 || filters.equipment.length > 0
                    ? "Clear Filters"
                    : "Create Your First Workout"}
                </button>
              </motion.div>
            ) : (
              <>
                {/* Results Summary */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-600">
                    Showing {filteredWorkouts.length} of {workouts.length} workouts
                  </p>
                  {(debouncedSearch || filters.categories.length > 0) && (
                    <button
                      onClick={handleClearFilters}
                      className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>

                {/* Workout Grid/List */}
                <motion.div
                  className={viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" 
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
                  {filteredWorkouts.map((workout) => (
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
                      className="px-8 py-4 bg-white border-2 border-teal-500 text-teal-600 rounded-xl font-semibold hover:bg-teal-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                      {isFetchingNextPage ? (
                        <div className="flex items-center space-x-3">
                          <div className="animate-spin w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full"></div>
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
        </div>
      </div>

      {/* Mobile Filter Panel */}
      <WorkoutFilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

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