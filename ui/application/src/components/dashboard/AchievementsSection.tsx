import { motion } from "framer-motion";
import { FaTrophy, FaCalendarAlt } from "react-icons/fa";

interface AchievementType {
  title: string;
  description: string;
  achievedDate: string;
  icon: string;
  color: string;
}

interface AchievementsSectionProps {
  achievements: AchievementType[];
  className?: string;
}

const AchievementsSection = ({ achievements, className = "" }: AchievementsSectionProps) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  if (achievements.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${className}`}
      >
        <div className="flex items-center space-x-2 mb-6">
          <FaTrophy className="text-yellow-600" />
          <h3 className="text-xl font-bold text-gray-900">Recent Achievements</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <FaTrophy className="text-4xl mx-auto mb-4 opacity-50" />
          <p>Keep working out to unlock achievements!</p>
          <p className="text-sm mt-2">Your first achievement is just around the corner.</p>
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
      <div className="flex items-center space-x-2 mb-6">
        <FaTrophy className="text-yellow-600" />
        <h3 className="text-xl font-bold text-gray-900">Recent Achievements</h3>
      </div>

      <div className="space-y-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={`${achievement.title}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 hover:shadow-md transition-all duration-300"
          >
            {/* Achievement Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-white text-xl shadow-md">
                {achievement.icon}
              </div>
            </div>

            {/* Achievement Details */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 truncate">
                {achievement.title}
              </h4>
              <p className="text-sm text-gray-600 mb-1">
                {achievement.description}
              </p>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <FaCalendarAlt className="text-xs" />
                <span>{formatDate(achievement.achievedDate)}</span>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <FaTrophy className="text-white text-sm" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      {achievements.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Keep up the great work! More achievements await you.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default AchievementsSection;