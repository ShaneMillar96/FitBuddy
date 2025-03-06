import { useDashboard } from "@/hooks/useDashboard";
import WeeklyWorkoutChart from "@/components/workout/WeeklyWorkoutChart";
import { FaTrophy, FaDumbbell, FaComments } from "react-icons/fa";
import { motion } from "framer-motion"; // For animations

const Dashboard = () => {
    const { data, isLoading, error } = useDashboard();

    // Loading State
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-950">
                <motion.div
                    className="h-12 w-12 border-4 border-t-blue-500 border-gray-700 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-center mt-20 font-semibold text-lg"
            >
                Failed to load dashboard. Try again later.
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6 lg:p-10">
            {/* Header Section */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-10"
            >
                <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    Your Dashboard
                </h1>
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
                        transition: { staggerChildren: 0.1 },
                    },
                }}
            >
                {/* Workouts Today */}
                <motion.div
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="bg-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 flex items-center group transition-all duration-300 hover:border-blue-400/50"
                >
                    <FaDumbbell className="text-blue-400 text-4xl mr-4 group-hover:scale-110 transition-transform duration-300" />
                    <div>
                        <p className="text-gray-400 text-sm">Workouts Today</p>
                        <p className="text-white text-2xl font-bold">{data.workoutsToday}</p>
                    </div>
                </motion.div>

                {/* Workouts This Week */}
                <motion.div
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="bg-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 flex items-center group transition-all duration-300 hover:border-blue-400/50"
                >
                    <FaDumbbell className="text-blue-400 text-4xl mr-4 group-hover:scale-110 transition-transform duration-300" />
                    <div>
                        <p className="text-gray-400 text-sm">Workouts This Week</p>
                        <p className="text-white text-2xl font-bold">{data.workoutsThisWeek}</p>
                    </div>
                </motion.div>

                {/* Workouts All Time */}
                <motion.div
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="bg-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 flex items-center group transition-all duration-300 hover:border-blue-400/50"
                >
                    <FaDumbbell className="text-blue-400 text-4xl mr-4 group-hover:scale-110 transition-transform duration-300" />
                    <div>
                        <p className="text-gray-400 text-sm">Workouts All Time</p>
                        <p className="text-white text-2xl font-bold">{data.workoutsAllTime}</p>
                    </div>
                </motion.div>

                {/* Total Comments */}
                <motion.div
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="bg-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 flex items-center group transition-all duration-300 hover:border-blue-400/50"
                >
                    <FaComments className="text-blue-400 text-4xl mr-4 group-hover:scale-110 transition-transform duration-300" />
                    <div>
                        <p className="text-gray-400 text-sm">Total Comments</p>
                        <p className="text-white text-2xl font-bold">{data.totalComments}</p>
                    </div>
                </motion.div>

                {/* Favorite Workout Type */}
                <motion.div
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="bg-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 flex items-center group transition-all duration-300 hover:border-blue-400/50"
                >
                    <FaDumbbell className="text-blue-400 text-4xl mr-4 group-hover:scale-110 transition-transform duration-300" />
                    <div>
                        <p className="text-gray-400 text-sm">Favorite Workout Type</p>
                        <p className="text-white text-2xl font-bold">{data.favoriteWorkoutType || "None"}</p>
                    </div>
                </motion.div>

                {/* Best Workout Result */}
                {data.bestWorkoutResult && (
                    <motion.div
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        className="bg-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 flex items-center group transition-all duration-300 hover:border-yellow-400/50"
                    >
                        <FaTrophy className="text-yellow-400 text-4xl mr-4 group-hover:scale-110 transition-transform duration-300" />
                        <div>
                            <p className="text-gray-400 text-sm">Best Result</p>
                            <p className="text-white text-lg font-bold">
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
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
                    Weekly Activity
                </h2>
                <div className="bg-gray-900/50 backdrop-blur-lg p-6 border border-gray-700/50 rounded-2xl shadow-lg">
                    <WeeklyWorkoutChart weeklyCounts={data.weeklyWorkoutCounts} />
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;