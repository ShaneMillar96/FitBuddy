import { useWorkouts } from "@/hooks/useWorkouts";

const WorkoutList = () => {
    const { data, isLoading, error } = useWorkouts({ pageSize: 10 });

    if (isLoading) return <p>Loading workouts...</p>;
    if (error) return <p className="text-red-500">Failed to load workouts.</p>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-blue-500 text-5xl font-extrabold mb-4">Workouts</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.data.map((workout) => (
                    <div key={workout.id}
                         className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
                        <h2 className="text-blue-600 text-xl font-semibold">{workout.name}</h2>
                        <p className="text-gray-700">{workout.description}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            <strong>Created by:</strong> {workout.createdBy.username}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkoutList;
