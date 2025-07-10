import { useState } from "react";
import { useWorkoutTypes } from "@/hooks/useWorkoutTypes";
import { useCreateWorkout } from "@/hooks/useCreateWorkout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import WorkoutBuilder from "@/components/workout/WorkoutBuilder";
import { CreateWorkoutExercise } from "@/interfaces/categories";


const CreateWorkout = () => {
    const navigate = useNavigate();
    const { data: workoutTypes, isLoading: typesLoading, error: typesError } = useWorkoutTypes();
    const createWorkoutMutation = useCreateWorkout();
    const [name, setName] = useState("");
    const [typeId, setTypeId] = useState<number | null>(null);
    
    // CrossFit-specific state
    const [selectedSubType, setSelectedSubType] = useState<number | undefined>();
    const [estimatedDuration, setEstimatedDuration] = useState<number | undefined>();
    const [exercises, setExercises] = useState<CreateWorkoutExercise[]>([]);

    const handleSubmit = () => {
        if (!name.trim() || name.length < 3 || name.length > 25) {
            toast.error("Name should be between 3 and 25 characters long.");
            return;
        }
        
        // Use a default type ID since we're no longer requiring legacy type selection
        const finalTypeId = typeId || 1; // Default to first workout type if none selected

        const workoutData = {
            name,
            typeId: finalTypeId,
            subTypeId: selectedSubType,
            estimatedDurationMinutes: estimatedDuration,
            exercises,
        };

        createWorkoutMutation.mutate(
            workoutData,
            {
                onSuccess: () => {
                    toast.success("Workout created successfully!");
                    setTimeout(() => navigate("/"), 2000);
                },
                onError: (error) => {
                    console.error("Error creating workout:", error);
                    toast.error("Failed to create workout. Please try again.");
                },
            }
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800 p-6 lg:p-8">
            {/* Header Section */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-semibold text-gray-900">Create CrossFit Workout</h1>
                <p className="text-gray-500 mt-2">Design a new CrossFit WOD to share with the community.</p>
            </motion.div>

            {/* Form Container */}
            <div className="space-y-8">
                {/* Basic Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100"
                >
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Workout Information</h2>
                    
                    {/* Workout Name */}
                    <div className="mb-6">
                        <label className="block text-gray-600 text-sm font-medium mb-2">Workout Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter workout name (3-25 chars)"
                            className="w-full px-5 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 placeholder-gray-400 text-gray-800"
                        />
                    </div>

                    {/* CrossFit Sub-Type Selection */}
                    <div className="mb-6">
                        <label className="block text-gray-600 text-sm font-medium mb-2">CrossFit Type</label>
                        <select
                            value={selectedSubType || ""}
                            onChange={(e) => setSelectedSubType(e.target.value ? Number(e.target.value) : undefined)}
                            className="w-full px-5 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 text-gray-800"
                        >
                            <option value="">Select CrossFit type</option>
                            <option value="7">EMOM - Every Minute on the Minute</option>
                            <option value="8">AMRAP - As Many Rounds As Possible</option>
                            <option value="9">For Time - Complete as fast as possible</option>
                            <option value="10">Tabata - 4-minute high-intensity protocol</option>
                        </select>
                    </div>

                    {/* Estimated Duration */}
                    <div className="mb-6">
                        <label className="block text-gray-600 text-sm font-medium mb-2">Estimated Duration (minutes)</label>
                        <input
                            type="number"
                            min="1"
                            max="600"
                            value={estimatedDuration || ""}
                            onChange={(e) => setEstimatedDuration(e.target.value ? Number(e.target.value) : undefined)}
                            placeholder="e.g., 20"
                            className="w-full px-5 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 placeholder-gray-400 text-gray-800"
                        />
                    </div>
                </motion.div>

                {/* Workout Builder */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100"
                >
                    <WorkoutBuilder
                        categoryId={2} // Always use CrossFit category
                        subTypeId={selectedSubType}
                        exercises={exercises}
                        onExercisesChange={setExercises}
                    />
                </motion.div>

                {/* Submit Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex justify-center"
                >
                    <button
                        onClick={handleSubmit}
                        disabled={createWorkoutMutation.isPending}
                        className="px-8 py-4 rounded-xl bg-gradient-to-r from-teal-400 to-blue-400 text-white font-medium hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-lg"
                    >
                        {createWorkoutMutation.isPending ? (
                            <span className="flex items-center space-x-2">
                                <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                                <span>Creating...</span>
                            </span>
                        ) : (
                            "Create Workout"
                        )}
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default CreateWorkout;