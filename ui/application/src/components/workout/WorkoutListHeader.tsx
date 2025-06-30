import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaTh, 
  FaList, 
  FaSort,
  FaClock,
  FaStar,
  FaUser,
  FaTimes
} from "react-icons/fa";
import { CATEGORY_ICONS, WORKOUT_CATEGORIES } from "@/interfaces/categories";

interface WorkoutListHeaderProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  activeFilters: {
    categories: number[];
    subTypes: number[];
    difficulty: [number, number];
    duration: [number, number];
    equipment: string[];
    creator: string;
  };
  onClearFilters: () => void;
  totalWorkouts: number;
}

const WorkoutListHeader = ({
  searchInput,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  showFilters,
  onToggleFilters,
  activeFilters,
  onClearFilters,
  totalWorkouts
}: WorkoutListHeaderProps) => {
  const navigate = useNavigate();
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: FaClock },
    { value: 'oldest', label: 'Oldest First', icon: FaClock },
    { value: 'popular', label: 'Most Popular', icon: FaStar },
    { value: 'difficulty-asc', label: 'Easiest First', icon: FaStar },
    { value: 'difficulty-desc', label: 'Hardest First', icon: FaStar },
    { value: 'duration-asc', label: 'Shortest First', icon: FaClock },
    { value: 'duration-desc', label: 'Longest First', icon: FaClock },
    { value: 'alphabetical', label: 'A to Z', icon: FaSort },
  ];

  const quickFilters = [
    { label: 'My Workouts', value: 'my', icon: FaUser },
    { label: 'Popular', value: 'popular', icon: FaStar },
    { label: 'Quick (<15min)', value: 'quick', icon: FaClock },
    { label: 'Recent', value: 'recent', icon: FaClock },
  ];

  const hasActiveFilters = 
    activeFilters.categories.length > 0 ||
    activeFilters.subTypes.length > 0 ||
    activeFilters.difficulty[0] > 1 || activeFilters.difficulty[1] < 5 ||
    activeFilters.duration[0] > 0 || activeFilters.duration[1] < 120 ||
    activeFilters.equipment.length > 0 ||
    activeFilters.creator !== '';

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

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      {/* Main Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        {/* Title and Stats */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Workouts</h1>
          <p className="text-gray-600">
            {totalWorkouts} workout{totalWorkouts !== 1 ? 's' : ''} available
            {hasActiveFilters && ' (filtered)'}
          </p>
        </div>

        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/create-workout")}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FaPlus className="text-sm" />
            <span>Create Workout</span>
          </motion.button>
          
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-teal-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaTh className="text-sm" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-teal-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaList className="text-sm" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaSort className="text-sm text-gray-500" />
                <span className="text-sm text-gray-700">Sort</span>
              </button>
              
              {showSortDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-20"
                >
                  <div className="p-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onSortChange(option.value);
                          setShowSortDropdown(false);
                        }}
                        className={`flex items-center space-x-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition-colors ${
                          sortBy === option.value ? 'bg-teal-50 text-teal-700' : 'text-gray-700'
                        }`}
                      >
                        <option.icon className="text-xs" />
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={onToggleFilters}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-teal-100 text-teal-700' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FaFilter className="text-sm" />
              <span className="text-sm">Filters</span>
              {hasActiveFilters && (
                <span className="bg-teal-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFilters.categories.length + activeFilters.equipment.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search workouts by name, description, or creator..."
            className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 placeholder-gray-400 text-gray-800 text-lg"
          />
        </div>
      </div>

      {/* Quick Filter Chips */}
      <div className="flex flex-wrap gap-3 mb-6">
        {quickFilters.map((filter) => (
          <motion.button
            key={filter.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-full hover:border-teal-300 hover:bg-teal-50 transition-all duration-300"
          >
            <filter.icon className="text-sm text-gray-500" />
            <span className="text-sm text-gray-700">{filter.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-50 rounded-xl p-4 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Active Filters</h3>
            <button
              onClick={onClearFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Category Filters */}
            {activeFilters.categories.map((categoryId) => (
              <span
                key={`category-${categoryId}`}
                className="flex items-center space-x-2 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm"
              >
                <span>{CATEGORY_ICONS[categoryId as keyof typeof CATEGORY_ICONS]}</span>
                <span>{getCategoryName(categoryId)}</span>
                <button className="text-teal-600 hover:text-teal-800">
                  <FaTimes className="text-xs" />
                </button>
              </span>
            ))}

            {/* Equipment Filters */}
            {activeFilters.equipment.map((equipment) => (
              <span
                key={`equipment-${equipment}`}
                className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                <span>🔧</span>
                <span>{equipment}</span>
                <button className="text-blue-600 hover:text-blue-800">
                  <FaTimes className="text-xs" />
                </button>
              </span>
            ))}

            {/* Difficulty Range */}
            {(activeFilters.difficulty[0] > 1 || activeFilters.difficulty[1] < 5) && (
              <span className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                <FaStar className="text-xs" />
                <span>
                  Difficulty: {activeFilters.difficulty[0]} - {activeFilters.difficulty[1]}
                </span>
                <button className="text-yellow-600 hover:text-yellow-800">
                  <FaTimes className="text-xs" />
                </button>
              </span>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WorkoutListHeader;