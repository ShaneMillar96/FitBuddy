import { useParams } from "react-router-dom";
import { useState } from "react";
import { useWorkoutDetails } from "@/hooks/useWorkoutDetails";

const WorkoutDetails = () => {
    const { id } = useParams();
    const { data: workout, isLoading, error } = useWorkoutDetails(id!);
    const [activeTab, setActiveTab] = useState<"results" | "comments">("results"); // ✅ Default tab

    if (isLoading) return <p className="text-gray-400 text-center">Loading workout details...</p>;
    if (error) return <p className="text-red-500 text-center">Failed to load workout details.</p>;
    if (!workout) return <p className="text-gray-500 text-center">Workout not found.</p>;

    return (
        <div className="container mx-auto p-6 bg-black text-gray-300 border border-gray-700 rounded-lg shadow-lg">
            <h1 className="text-white text-4xl font-extrabold">{workout.name}</h1>
            <p className="text-gray-400 mt-2">
                <strong className="text-white">Type:</strong> {workout.type.name}
            </p>
            <p className="text-gray-400 mt-2">
                <strong className="text-white">Created by:</strong> {workout.createdBy.username}
            </p>
            <p className="text-gray-400 mt-2">
                <strong className="text-white">Created on:</strong> {new Date(workout.createdDate).toLocaleDateString()}
            </p>
            <p className="text-gray-300 mt-4 border-t border-gray-700 pt-4">{workout.description}</p>

            <div className="mt-6">
                <div className="flex border-b border-gray-700">
                    <button
                        className={`py-2 px-4 transition-all duration-200 ${
                            activeTab === "results"
                                ? "border-b-2 border-white text-white"
                                : "text-gray-500 hover:text-gray-300"
                        }`}
                        onClick={() => setActiveTab("results")}
                    >
                        Results
                    </button>
                    <button
                        className={`py-2 px-4 ml-4 transition-all duration-200 ${
                            activeTab === "comments"
                                ? "border-b-2 border-white text-white"
                                : "text-gray-500 hover:text-gray-300"
                        }`}
                        onClick={() => setActiveTab("comments")}
                    >
                        Comments
                    </button>
                </div>

                {/* Tab Content */}
                <div className="mt-4 p-4 bg-gray-900 border border-gray-700 rounded-lg">
                    {activeTab === "results" ? (
                        <p className="text-gray-400">Results section coming soon...</p>
                    ) : (
                        <p className="text-gray-400">Comments section coming soon...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkoutDetails;
