import { useWorkouts } from "@/hooks/useWorkouts";
import { useNavigate } from "react-router-dom";

const WorkoutList = () => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useWorkouts({ pageSize: 10 });
    const navigate = useNavigate();

    if (isLoading) return <p className="text-gray-400 text-center">Loading workouts...</p>;
    if (error) return <p className="text-red-500 text-center">Failed to load workouts.</p>;

    return (
        <div className="container mx-auto p-6 bg-black text-gray-300 border border-gray-700 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.pages.map((page) =>
                    page.data.map((workout) => (
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
                    ))
                )}
            </div>

            {hasNextPage && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => fetchNextPage()}
                        className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-white"
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
        </div>
    );
};

export default WorkoutList;
