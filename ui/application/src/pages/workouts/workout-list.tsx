import { useWorkouts } from "@/hooks/useWorkouts";
import { useNavigate } from "react-router-dom";

const WorkoutList = () => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useWorkouts({ pageSize: 10 });
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-50"></div>
            </div>
        );
    }

    if (error) return <p className="text-red-500 text-center">Failed to load workouts.</p>;

    const workouts = data?.pages.flatMap((page) => page.data) || [];

    return (
        <div className="container mx-auto p-6 bg-black text-gray-300 border border-gray-700 rounded-lg shadow-lg">
            <h1 className="text-white text-3xl font-bold mb-4 text-center">Workouts</h1>

            {workouts.length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                    <p className="text-lg">🚀 No workouts have been created yet.</p>
                    <p className="text-sm text-gray-500">Be the first to create a new workout!</p>
                    <button
                        onClick={() => navigate("/create-workout")}
                        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        + Create Workout
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div
                            onClick={() => navigate("/create-workout")}
                            className="bg-gray-900 text-white border border-gray-700 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 cursor-pointer hover:border-white flex items-center justify-center"
                        >
                            <h2 className="text-white text-xl font-semibold">New Workout +</h2>
                        </div>

                        {workouts.map((workout) => (
                            <div
                                key={workout.id}
                                onClick={() => navigate(`/workouts/${workout.id}`)}
                                className="bg-gray-900 text-white border border-gray-700 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 cursor-pointer hover:border-white"
                            >
                                <h2 className="text-white text-xl font-semibold">{workout.name}</h2>
                                <p className="text-gray-500 text-sm mt-2">
                                    <strong className="text-white">Created by:</strong> {workout.createdBy.username}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    <strong className="text-white">Type:</strong> {workout.type.name}
                                </p>
                            </div>
                        ))}
                    </div>

                    {hasNextPage && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => fetchNextPage()}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                disabled={isFetchingNextPage}
                            >
                                {isFetchingNextPage ? (
                                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                                ) : (
                                    "Load More"
                                )}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default WorkoutList;
