import { useWorkouts } from "@/hooks/useWorkouts";
import { useNavigate } from "react-router-dom";
import { FaTrophy, FaCommentDots, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion"; // For subtle animations

const WorkoutList = () => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useWorkouts({ pageSize: 10 });
    const navigate = useNavigate();

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
    if (error) return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-center mt-20 font-semibold text-lg"
        >
            Failed to load workouts. Try again later.
        </motion.div>
    );

    const workouts = data?.pages.flatMap((page) => page.data) || [];

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6 lg:p-10">
            {/* Header Section */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center mb-10"
            >
            </motion.div>

            {/* Empty State */}
            {workouts.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <p className="text-2xl font-light text-gray-400 mb-6">No workouts yet. Start your journey!</p>
                    <button
                        onClick={() => navigate("/create-workout")}
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-lg hover:scale-105 transition-transform duration-300 shadow-lg"
                    >
                        + Create Workout
                    </button>
                </motion.div>
            ) : (
                <>
                    {/* Workout Grid */}
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
                        {/* New Workout Card */}
                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                            onClick={() => navigate("/create-workout")}
                            className="relative flex items-center justify-center h-64 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl cursor-pointer overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-10 transition-opacity duration-300" />
                            <h2 className="text-2xl font-bold text-white z-10">New Workout +</h2>
                        </motion.div>

                        {/* Workout Cards */}
                        {workouts.map((workout) => (
                            <motion.div
                                key={workout.id}
                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                onClick={() => navigate(`/workouts/${workout.id}`)}
                                className="relative bg-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 shadow-lg cursor-pointer group overflow-hidden"
                            >
                                {/* Gradient Overlay on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <h2 className="text-xl font-bold text-white relative z-10">{workout.name}</h2>
                                <p className="text-gray-400 text-sm mt-2 relative z-10">
                                    <span className="text-gray-300">By:</span> {workout.createdBy.username}
                                </p>
                                <p className="text-gray-400 text-sm relative z-10">
                                    <span className="text-gray-300">Type:</span> {workout.workoutType.name}
                                </p>
                                <div className="flex justify-between items-center mt-4 text-gray-400 relative z-10">
                                    <span className="flex items-center gap-1">
                                        <FaTrophy className="text-yellow-400" /> {workout.resultsLogged}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FaCommentDots className="text-blue-400" /> {workout.commentsCount}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Load More Button */}
                    {hasNextPage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-10 text-center"
                        >
                            <button
                                onClick={() => fetchNextPage()}
                                className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-full hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isFetchingNextPage}
                            >
                                {isFetchingNextPage ? (
                                    <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                                ) : (
                                    "Load More"
                                )}
                            </button>
                        </motion.div>
                    )}
                </>
            )}
        </div>
    );
};

export default WorkoutList;