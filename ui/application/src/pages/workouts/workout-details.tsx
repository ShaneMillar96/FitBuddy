import { useState } from "react";
import { useParams } from "react-router-dom";
import { useWorkoutDetails } from "@/hooks/useWorkoutDetails";
import Tabs from "@/components/layout/Tabs";
import Results from "@/components/workout/Results";
import Comments from "@/components/workout/Comments";
import { motion } from "framer-motion"; // For animations

const WorkoutDetails = () => {
    const { id } = useParams();
    const { data: workout, isLoading, error } = useWorkoutDetails(id!);
    const [activeTab, setActiveTab] = useState("Results");

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
                Failed to load workout details. Try again later.
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
                className="mb-8"
            >
                <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    {workout.name}
                </h1>
                <div className="mt-4 space-y-2">
                    <p className="text-gray-400 text-lg">
                        <span className="text-gray-300 font-semibold">Type:</span> {workout.workoutType.name}
                    </p>
                    <p className="text-gray-400 text-lg">
                        <span className="text-gray-300 font-semibold">Created by:</span> {workout.createdBy.username}
                    </p>
                    <p className="text-gray-400 text-lg">
                        <span className="text-gray-300 font-semibold">Created on:</span>{" "}
                        {new Date(workout.createdDate).toLocaleDateString()}
                    </p>
                </div>
            </motion.div>

            {/* Description Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 mb-8 text-gray-300 whitespace-pre-line shadow-lg"
            >
                {workout.description || "No description available."}
            </motion.div>

            {/* Tabs Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <Tabs
                    tabs={[
                        { label: "Results", content: <Results workoutId={id!} scoreType={workout.scoreType.name} /> },
                        { label: "Comments", content: <Comments workoutId={id!} /> },
                    ]}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </motion.div>
        </div>
    );
};

export default WorkoutDetails;