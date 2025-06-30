import { useDashboard } from "@/hooks/useDashboard";
import { motion } from "framer-motion";
import { 
  FaDumbbell, 
  FaFire, 
  FaMedal, 
  FaChartLine,
  FaCalendarWeek,
  FaRocket,
  FaUser
} from "react-icons/fa";

// Import our new dashboard components
import PersonalStatsSection from "@/components/dashboard/PersonalStatsSection";
import WeeklyProgressSection from "@/components/dashboard/WeeklyProgressSection";
import CategoryBreakdownSection from "@/components/dashboard/CategoryBreakdownSection";
import AchievementsSection from "@/components/dashboard/AchievementsSection";
import WeeklyWorkoutChart from "@/components/workout/WeeklyWorkoutChart";

// Skeleton loader components
const SkeletonCard = ({ className = "" }: { className?: string }) => (
  <div className={`bg-gray-100 animate-pulse rounded-2xl p-6 shadow-sm ${className}`}>
    <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  </div>
);

const SkeletonStatsGrid = () => (
  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-gray-100 animate-pulse rounded-xl p-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl mx-auto mb-3"></div>
        <div className="h-6 bg-gray-200 rounded w-12 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
      </div>
    ))}
  </div>
);

const EnhancedDashboard = () => {
  const { data, isLoading, error } = useDashboard();

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
              <SkeletonStatsGrid />
            </div>
          </div>

          {/* Content Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <SkeletonCard className="lg:col-span-2" />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">We couldn't load your dashboard. Please try again later.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Welcome Back! 👋
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Here's your fitness journey at a glance
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Today's Date</div>
                <div className="font-semibold text-gray-900">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white">
                <FaUser />
              </div>
            </div>
          </div>

          {/* Current Streak Highlight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 text-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                  <FaFire className="text-3xl" />
                </div>
                <div>
                  <p className="text-lg font-semibold opacity-90">Current Streak</p>
                  <p className="text-3xl font-bold">{data.currentStreak} Days</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80">"Consistency builds champions!"</p>
                <div className="flex items-center space-x-1 mt-2">
                  {[...Array(Math.min(5, data.currentStreak))].map((_, i) => (
                    <FaFire key={i} className="text-yellow-300" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Personal Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <PersonalStatsSection
            stats={{
              workoutsCreated: data.workoutsCreated,
              workoutsCompleted: data.workoutsCompleted,
              favoriteWorkouts: data.favoriteWorkouts,
              totalMinutesExercised: data.totalMinutesExercised,
              currentStreak: data.currentStreak,
              personalBests: data.personalBests
            }}
          />
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Weekly Progress - Spans 2 columns on large screens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <WeeklyProgressSection
              weeklyGoal={data.weeklyGoal}
              weeklyProgress={data.weeklyProgress}
              weeklyCompletionPercentage={data.weeklyCompletionPercentage}
              trendingMetrics={data.trendingMetrics}
            />
          </motion.div>

          {/* Quick Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center space-x-2 mb-6">
              <FaRocket className="text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900">Quick Stats</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaDumbbell className="text-blue-600" />
                  <span className="font-medium text-gray-900">Today</span>
                </div>
                <span className="text-xl font-bold text-blue-600">{data.workoutsToday}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaCalendarWeek className="text-green-600" />
                  <span className="font-medium text-gray-900">This Week</span>
                </div>
                <span className="text-xl font-bold text-green-600">{data.workoutsThisWeek}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaChartLine className="text-purple-600" />
                  <span className="font-medium text-gray-900">All Time</span>
                </div>
                <span className="text-xl font-bold text-purple-600">{data.workoutsAllTime}</span>
              </div>

              {data.bestWorkoutResult && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaMedal className="text-yellow-600" />
                    <div className="min-w-0">
                      <span className="font-medium text-gray-900 block truncate">Best Result</span>
                      <span className="text-xs text-gray-600 truncate">#{data.bestWorkoutResult.rank} in {data.bestWorkoutResult.workoutName}</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-yellow-600">{data.bestWorkoutResult.result}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-1"
          >
            <CategoryBreakdownSection categoryBreakdown={data.categoryBreakdown} />
          </motion.div>

          {/* Recent Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="lg:col-span-1"
          >
            <AchievementsSection achievements={data.recentAchievements} />
          </motion.div>

          {/* Weekly Activity Chart - Full width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="lg:col-span-2 xl:col-span-3"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 mb-6">
                <FaChartLine className="text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">Weekly Activity</h3>
                <div className="text-sm text-gray-500 ml-auto">
                  Last 7 days
                </div>
              </div>
              <div className="h-64">
                <WeeklyWorkoutChart weeklyCounts={data.weeklyWorkoutCounts} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;