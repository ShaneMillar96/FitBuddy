import { motion } from "framer-motion";
import { FaChartPie, FaClock } from "react-icons/fa";

interface CategoryStatsType {
  categoryId: number;
  categoryName: string;
  workoutCount: number;
  totalMinutes: number;
  color: string;
}

interface CategoryBreakdownSectionProps {
  categoryBreakdown: CategoryStatsType[];
  className?: string;
}

const CategoryBreakdownSection = ({ categoryBreakdown, className = "" }: CategoryBreakdownSectionProps) => {
  const totalWorkouts = categoryBreakdown.reduce((sum, cat) => sum + cat.workoutCount, 0);
  const totalMinutes = categoryBreakdown.reduce((sum, cat) => sum + cat.totalMinutes, 0);

  const getPercentage = (count: number) => {
    return totalWorkouts > 0 ? Math.round((count / totalWorkouts) * 100) : 0;
  };

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'weight session': return '🏋️';
      case 'crossfit wod': return '💪';
      case 'running intervals': return '🏃';
      case 'swimming': return '🏊';
      case 'hyrox': return '⚡';
      case 'stretching': return '🧘';
      default: return '💪';
    }
  };

  if (categoryBreakdown.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${className}`}
      >
        <div className="flex items-center space-x-2 mb-6">
          <FaChartPie className="text-purple-600" />
          <h3 className="text-xl font-bold text-gray-900">Workout Categories</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <FaChartPie className="text-4xl mx-auto mb-4 opacity-50" />
          <p>Complete some workouts to see your category breakdown!</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FaChartPie className="text-purple-600" />
          <h3 className="text-xl font-bold text-gray-900">Workout Categories</h3>
        </div>
        <div className="text-sm text-gray-600">
          {totalWorkouts} total workouts
        </div>
      </div>

      <div className="space-y-4">
        {categoryBreakdown.map((category, index) => (
          <motion.div
            key={category.categoryId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4"
          >
            {/* Category Icon & Name */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-sm"
                style={{ backgroundColor: category.color }}
              >
                {getCategoryIcon(category.categoryName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {category.categoryName}
                </div>
                <div className="text-sm text-gray-500 flex items-center space-x-2">
                  <span>{category.workoutCount} workouts</span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <FaClock className="text-xs" />
                    <span>{Math.floor(category.totalMinutes / 60)}h {category.totalMinutes % 60}m</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center space-x-3 w-32">
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getPercentage(category.workoutCount)}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 w-8">
                {getPercentage(category.workoutCount)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">{totalWorkouts}</div>
            <div className="text-sm text-gray-600">Total Workouts</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
            </div>
            <div className="text-sm text-gray-600">Total Time</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryBreakdownSection;