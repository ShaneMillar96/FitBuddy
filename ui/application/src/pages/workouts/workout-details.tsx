import { useParams } from "react-router-dom";
import { useWorkoutDetails } from "@/hooks/useWorkoutDetails";
import Tabs from "@/components/layout/Tabs";
import Results from "@/components/workout/Results";
import Comments from "@/components/workout/Comments";

const WorkoutDetails = () => {
    const { id } = useParams();
    const { data: workout, isLoading, error } = useWorkoutDetails(id!);

    if (isLoading) return <p className="text-gray-400 text-center">Loading workout details...</p>;
    if (error) return <p className="text-red-500 text-center">Failed to load workout details.</p>;
    if (!workout) return <p className="text-gray-500 text-center">Workout not found.</p>;

    return (
        <div className="container mx-auto p-6 bg-black text-gray-300 border border-gray-700 rounded-lg shadow-lg">
            <h1 className="text-white text-4xl font-extrabold">
                {workout.name} <span className="text-gray-400 text-2xl">({workout.type.name})</span>
            </h1>

            <pre className="text-gray-300 text-lg mt-4 whitespace-pre-wrap leading-relaxed border-t border-gray-700 pt-4">
                {workout.description}
            </pre>

            <Tabs
                tabs={[
                    { label: "Results", content: <Results workoutId={id!} /> },
                    { label: "Comments", content: <Comments workoutId={id!} /> },
                ]}
            />
        </div>
    );
};

export default WorkoutDetails;
