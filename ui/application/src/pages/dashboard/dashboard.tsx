import { useDashboard } from "@/hooks/useDashboard";
import WeeklyWorkoutChart from "@/components/workout/WeeklyWorkoutChart";
import { FaTrophy, FaDumbbell, FaComments } from "react-icons/fa";

const Dashboard = () => {
    const { data, isLoading, error } = useDashboard();

    if (isLoading) return <p className="text-gray-400 text-center">Loading dashboard...</p>;
    if (error) return <p className="text-red-500 text-center">Failed to load dashboard.</p>;

    return (
        <div className="container mx-auto p-6 bg-black text-gray-300 border border-gray-700 rounded-lg shadow-lg">
            <h1 className="text-white text-4xl font-extrabold mb-6">Your Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card flex items-center p-6">
                    <FaDumbbell className="text-blue-400 text-3xl mr-4" />
                    <div>
                        <p className="text-gray-400">Workouts Today</p>
                        <p className="text-white text-2xl font-bold">{data.workoutsToday}</p>
                    </div>
                </div>
                <div className="card flex items-center p-6">
                    <FaDumbbell className="text-blue-400 text-3xl mr-4" />
                    <div>
                        <p className="text-gray-400">Workouts This Week</p>
                        <p className="text-white text-2xl font-bold">{data.workoutsThisWeek}</p>
                    </div>
                </div>
                <div className="card flex items-center p-6">
                    <FaDumbbell className="text-blue-400 text-3xl mr-4" />
                    <div>
                        <p className="text-gray-400">Workouts All Time</p>
                        <p className="text-white text-2xl font-bold">{data.workoutsAllTime}</p>
                    </div>
                </div>
                <div className="card flex items-center p-6">
                    <FaComments className="text-blue-400 text-3xl mr-4" />
                    <div>
                        <p className="text-gray-400">Total Comments</p>
                        <p className="text-white text-2xl font-bold">{data.totalComments}</p>
                    </div>
                </div>
                <div className="card flex items-center p-6">
                    <FaDumbbell className="text-blue-400 text-3xl mr-4" />
                    <div>
                        <p className="text-gray-400">Favorite Workout Type</p>
                        <p className="text-white text-2xl font-bold">{data.favoriteWorkoutType || "None"}</p>
                    </div>
                </div>
                {data.bestWorkoutResult && (
                    <div className="card flex items-center p-6">
                        <FaTrophy className="text-yellow-400 text-3xl mr-4" />
                        <div>
                            <p className="text-gray-400">Best Result</p>
                            <p className="text-white text-lg font-bold">
                                #{data.bestWorkoutResult.rank} in {data.bestWorkoutResult.workoutName} ({data.bestWorkoutResult.result})
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-8">
                <h2 className="text-white text-2xl font-bold mb-4">Weekly Activity</h2>
                <div className="bg-gray-900 p-4 border border-gray-700 rounded-lg">
                    <WeeklyWorkoutChart weeklyCounts={data.weeklyWorkoutCounts} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;