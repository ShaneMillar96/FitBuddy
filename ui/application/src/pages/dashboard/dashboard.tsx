import { useDashboard } from "@/hooks/useDashboard";
import WeeklyWorkoutChart from "@/components/workout/WeeklyWorkoutChart";
import { FaDumbbell, FaFire, FaMedal } from "react-icons/fa";
import { motion } from "framer-motion";

// Skeleton loader for stats cards
const SkeletonStatCard = () => (
    <div className="bg-gray-100 animate-pulse rounded-2xl p-6 shadow-sm">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
    </div>
);

const Dashboard = () => {
    const { data, isLoading, error } = useDashboard();

    // Loading State with Skeleton Cards
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6 lg:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, idx) => (
                        <SkeletonStatCard key={idx} />
                    ))}
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 text-red-500 font-medium text-lg"
            >
                Oops! Something went wrong. Please try again later.
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800 p-6 lg:p-8">
            {/* Header Section */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-10"
            >
                <h1 className="text-4xl font-semibold text-gray-900">Welcome Back!</h1>
                <p className="text-gray-500 mt-2">Keep up the great work! Here’s your fitness overview.</p>
            </motion.div>

            {/* Streak Indicator */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-r from-teal-400 to-blue-400 text-white rounded-2xl p-6 mb-8 shadow-md flex items-center justify-between"
            >
                <div className="flex items-center">
                    <FaFire className="text-3xl mr-4" />
                    <div>
                        <p className="text-lg font-semibold">Current Streak</p>
                        <p className="text-2xl font-bold">{data?.streak || 0} Days</p>
                    </div>
                </div>
                <p className="text-sm italic opacity-80">"Keep the fire burning!"</p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.15 },
                    },
                }}
            >
                {/* Workouts Today */}
                <motion.div
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex items-center"
                >
                    <FaDumbbell className="text-teal-400 text-3xl mr-4" />
                    <div>
                        <p className="text-gray-500 text-sm">Workouts Today</p>
                        <p className="text-gray-800 text-2xl font-semibold">{data.workoutsToday}</p>
                    </div>
                </motion.div>

                {/* Workouts This Week */}
                <motion.div
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex items-center"
                >
                    <FaDumbbell className="text-teal-400 text-3xl mr-4" />
                    <div>
                        <p className="text-gray-500 text-sm">Workouts This Week</p>
                        <p className="text-gray-800 text-2xl font-semibold">{data.workoutsThisWeek}</p>
                    </div>
                </motion.div>

                {/* Workouts All Time */}
                <motion.div
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex items-center"
                >
                    <FaDumbbell className="text-teal-400 text-3xl mr-4" />
                    <div>
                        <p className="text-gray-500 text-sm">Workouts All Time</p>
                        <p className="text-gray-800 text-2xl font-semibold">{data.workoutsAllTime}</p>
                    </div>
                </motion.div>

                {/* Total Comments */}
                <motion.div
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex items-center"
                >
                    <FaDumbbell className="text-teal-400 text-3xl mr-4" />
                    <div>
                        <p className="text-gray-500 text-sm">Total Comments</p>
                        <p className="text-gray-800 text-2xl font-semibold">{data.totalComments}</p>
                    </div>
                </motion.div>

                {/* Favorite Workout Type */}
                <motion.div
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex items-center"
                >
                    <FaDumbbell className="text-teal-400 text-3xl mr-4" />
                    <div>
                        <p className="text-gray-500 text-sm">Favorite Workout Type</p>
                        <p className="text-gray-800 text-2xl font-semibold">{data.favoriteWorkoutType || "None"}</p>
                    </div>
                </motion.div>

                {/* Best Workout Result */}
                {data.bestWorkoutResult && (
                    <motion.div
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex items-center"
                    >
                        <FaMedal className="text-yellow-400 text-3xl mr-4" />
                        <div>
                            <p className="text-gray-500 text-sm">Best Result</p>
                            <p className="text-gray-800 text-lg font-semibold">
                                #{data.bestWorkoutResult.rank} in {data.bestWorkoutResult.workoutName} ({data.bestWorkoutResult.result})
                            </p>
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* Weekly Activity Chart */}
            <motion.div
                className="mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Weekly Activity</h2>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <WeeklyWorkoutChart weeklyCounts={data.weeklyWorkoutCounts} />
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;