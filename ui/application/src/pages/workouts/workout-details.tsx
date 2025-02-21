import { useState } from "react";
import { useParams } from "react-router-dom";
import { useWorkoutDetails } from "@/hooks/useWorkoutDetails";
import Tabs from "@/components/layout/Tabs";
import Results from "@/components/workout/Results";
import Comments from "@/components/workout/Comments";

const WorkoutDetails = () => {
    const { id } = useParams();
    const { data: workout, isLoading, error } = useWorkoutDetails(id!);
    const [activeTab, setActiveTab] = useState("Results");

    if (isLoading) return <p className="text-gray-400 text-center">Loading workout details...</p>;
    if (error) return <p className="text-red-500 text-center">Failed to load workout details.</p>;

    return (
        <div className="container mx-auto p-6 bg-black text-gray-300 border border-gray-700 rounded-lg shadow-lg">
            <h1 className="text-white text-4xl font-extrabold">{workout.name}</h1>
            <p className="text-gray-400 mt-2">
                <strong className="text-white">Type:</strong> {workout.workoutType.name}
            </p>
            <p className="text-gray-400 mt-2">
                <strong className="text-white">Created by:</strong> {workout.createdBy.username}
            </p>
            <p className="text-gray-400 mt-2">
                <strong className="text-white">Created on:</strong> {new Date(workout.createdDate).toLocaleDateString()}
            </p>

            <div className="text-gray-300 mt-4 border-t border-gray-700 pt-4 whitespace-pre-line">
                {workout.description}
            </div>

            <Tabs
                tabs={[
                    { label: "Results", content: <Results workoutId={id!} scoreType={workout.scoreType.name} /> },
                    { label: "Comments", content: <Comments workoutId={id!} /> },
                ]}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
        </div>
    );
};

export default WorkoutDetails;
