import { motion } from "framer-motion";
import { 
  FaDumbbell, 
  FaFire, 
  FaHeart, 
  FaClock,
  FaTrophy,
  FaChartLine
} from "react-icons/fa";

interface PersonalStatsProps {
  className?: string;
}

const PersonalStats = ({ className = "" }: PersonalStatsProps) => {
  // Mock data - in a real app, this would come from an API
  const stats = {
    workoutsCreated: 12,
    workoutsCompleted: 45,
    favoriteWorkouts: 8,
    totalMinutes: 2340,
    currentStreak: 7,
    personalBests: 3
  };

  const statItems = [
    {
      icon: FaDumbbell,
      label: "Created",
      value: stats.workoutsCreated,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: FaFire,
      label: "Completed",
      value: stats.workoutsCompleted,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      icon: FaHeart,
      label: "Favorites",
      value: stats.favoriteWorkouts,
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      icon: FaClock,
      label: "Minutes",
      value: `${Math.floor(stats.totalMinutes / 60)}h`,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: FaChartLine,
      label: "Streak",
      value: `${stats.currentStreak}d`,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: FaTrophy,
      label: "PRs",
      value: stats.personalBests,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div className={`w-12 h-12 ${stat.bgColor} ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className="text-lg" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-600">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">This Week's Progress</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: '70%' }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">3 of 4 planned workouts</p>
        </div>
      </div>
    </motion.div>
  );
};

export default PersonalStats;