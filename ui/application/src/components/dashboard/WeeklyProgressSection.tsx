import { motion } from "framer-motion";
import { FaBullseye, FaCalendarCheck, FaArrowUp, FaFire } from "react-icons/fa";

interface WeeklyProgressSectionProps {
  weeklyGoal: number;
  weeklyProgress: number;
  weeklyCompletionPercentage: number;
  trendingMetrics: {
    workoutFrequencyTrend: number;
    mostActiveDay: string;
    consecutiveDaysActive: number;
  };
  className?: string;
}

const WeeklyProgressSection = ({ 
  weeklyGoal, 
  weeklyProgress, 
  weeklyCompletionPercentage,
  trendingMetrics,
  className = "" 
}: WeeklyProgressSectionProps) => {
  const isGoalMet = weeklyProgress >= weeklyGoal;
  const progressColor = isGoalMet ? "bg-green-500" : "bg-teal-500";
  const progressBg = isGoalMet ? "bg-green-100" : "bg-gray-200";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Weekly Progress</h3>
        <div className="flex items-center space-x-2">
          <FaBullseye className="text-teal-600" />
          <span className="text-sm font-medium text-gray-600">Goal: {weeklyGoal} workouts</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {weeklyProgress} of {weeklyGoal} workouts completed
          </span>
          <span className="text-sm font-bold text-gray-900">
            {Math.round(weeklyCompletionPercentage)}%
          </span>
        </div>
        <div className={`w-full ${progressBg} rounded-full h-3 overflow-hidden`}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, weeklyCompletionPercentage)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${progressColor} rounded-full transition-all duration-500 relative`}
          >
            {isGoalMet && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-30 animate-pulse"></div>
            )}
          </motion.div>
        </div>
        {isGoalMet && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-green-600 font-medium mt-2"
          >
            🎉 Goal achieved! Keep up the great work!
          </motion.p>
        )}
      </div>

      {/* Weekly Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <FaArrowUp className="text-purple-600 text-lg mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-900">
            {trendingMetrics.workoutFrequencyTrend > 0 ? '+' : ''}{Math.round(trendingMetrics.workoutFrequencyTrend)}%
          </div>
          <div className="text-xs text-gray-600">vs Last Week</div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <FaCalendarCheck className="text-blue-600 text-lg mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-900">
            {trendingMetrics.mostActiveDay}
          </div>
          <div className="text-xs text-gray-600">Most Active Day</div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <FaFire className="text-orange-600 text-lg mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-900">
            {trendingMetrics.consecutiveDaysActive}d
          </div>
          <div className="text-xs text-gray-600">Active Streak</div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeeklyProgressSection;