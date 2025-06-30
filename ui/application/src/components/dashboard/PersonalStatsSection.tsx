import { motion } from "framer-motion";
import { 
  FaDumbbell, 
  FaFire, 
  FaHeart, 
  FaClock,
  FaTrophy,
  FaChartLine
} from "react-icons/fa";

interface PersonalStatsSectionProps {
  stats: {
    workoutsCreated: number;
    workoutsCompleted: number;
    favoriteWorkouts: number;
    totalMinutesExercised: number;
    currentStreak: number;
    personalBests: number;
  };
  className?: string;
}

const PersonalStatsSection = ({ stats, className = "" }: PersonalStatsSectionProps) => {
  const statItems = [
    {
      icon: FaDumbbell,
      label: "Created",
      value: stats.workoutsCreated,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-200"
    },
    {
      icon: FaFire,
      label: "Completed",
      value: stats.workoutsCompleted,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      borderColor: "border-orange-200"
    },
    {
      icon: FaHeart,
      label: "Favorites",
      value: stats.favoriteWorkouts,
      color: "text-red-600",
      bgColor: "bg-red-100",
      borderColor: "border-red-200"
    },
    {
      icon: FaClock,
      label: "Hours",
      value: `${Math.floor(stats.totalMinutesExercised / 60)}h`,
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-200"
    },
    {
      icon: FaChartLine,
      label: "Streak",
      value: `${stats.currentStreak}d`,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      borderColor: "border-purple-200"
    },
    {
      icon: FaTrophy,
      label: "PRs",
      value: stats.personalBests,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-200"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${className}`}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6">Your Fitness Stats</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statItems.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`text-center p-4 rounded-xl border-2 ${stat.borderColor} ${stat.bgColor} hover:shadow-md transition-all duration-300`}
          >
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3 bg-white shadow-sm`}>
              <stat.icon className="text-xl" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PersonalStatsSection;