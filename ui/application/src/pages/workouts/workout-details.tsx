import { useState } from "react";
import { useParams } from "react-router-dom";
import { useWorkoutDetails } from "@/hooks/useWorkoutDetails";
import Tabs from "@/components/layout/Tabs";
import Results from "@/components/workout/Results";
import Comments from "@/components/workout/Comments";
import { motion } from "framer-motion";

// Skeleton loader for the header section
const SkeletonHeader = () => (
    <div className="bg-gray-100 animate-pulse rounded-2xl p-6 shadow-sm">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
);

const WorkoutDetails = () => {
    const { id } = useParams();
    const { data: workout, isLoading, error } = useWorkoutDetails(id!);
    const [activeTab, setActiveTab] = useState("Results");

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6 lg:p-8">
                <SkeletonHeader />
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 text-red-500 font-medium text-lg"
            >
                Failed to load workout details. Please try again later.
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800 p-6 lg:p-8">
            {/* Header Section */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-semibold text-gray-900">{workout.name}</h1>
                <div className="mt-4 space-y-2">
                    <p className="text-gray-500 text-base">
                        <span className="text-gray-600 font-medium">Type:</span> {workout.workoutType.name}
                    </p>
                    <p className="text-gray-500 text-base">
                        <span className="text-gray-600 font-medium">Created by:</span> {workout.createdBy.username}
                    </p>
                    <p className="text-gray-500 text-base">
                        <span className="text-gray-600 font-medium">Created on:</span>{" "}
                        {new Date(workout.createdDate).toLocaleDateString()}
                    </p>
                </div>
            </motion.div>

            {/* CrossFit WOD Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 text-gray-600 whitespace-pre-line"
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">CrossFit WOD</h3>
                <p className="text-gray-600">
                  {workout.workoutType.name} • {workout.estimatedDurationMinutes} minutes
                </p>
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