import { useState } from "react";
import { useWorkoutTypes } from "@/hooks/useWorkoutTypes";
import { useCreateWorkout } from "@/hooks/useCreateWorkout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

// Skeleton for loading state
const SkeletonSelect = () => (
    <div className="bg-gray-100 animate-pulse rounded-xl p-3 w-full h-12"></div>
);

const CreateWorkout = () => {
    const navigate = useNavigate();
    const { data: workoutTypes, isLoading: typesLoading, error: typesError } = useWorkoutTypes();
    const createWorkoutMutation = useCreateWorkout();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [typeId, setTypeId] = useState<number | null>(null);

    const handleSubmit = () => {
        if (!name.trim() || name.length < 3 || name.length > 25) {
            toast.error("Name should be between 3 and 25 characters long.");
            return;
        }
        if (!description.trim() || description.length < 10) {
            toast.error("Description should be at least 10 characters long.");
            return;
        }
        if (!typeId) {
            toast.error("Please select a workout type.");
            return;
        }

        createWorkoutMutation.mutate(
            { name, description, typeId },
            {
                onSuccess: () => {
                    toast.success("Workout created successfully!");
                    setTimeout(() => navigate("/"), 2000);
                },
                onError: () => {
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
                <h1 className="text-4xl font-semibold text-gray-900">Create Workout</h1>
                <p className="text-gray-500 mt-2">Design a new workout to share with the community.</p>
            </motion.div>

            {/* Form Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100"
            >
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

                {/* Workout Type */}
                <div className="mb-6">
                    <label className="block text-gray-600 text-sm font-medium mb-2">Workout Type</label>
                    {typesLoading ? (
                        <SkeletonSelect />
                    ) : typesError ? (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 text-center py-2"
                        >
                            Failed to load workout types.
                        </motion.p>
                    ) : (
                        <select
                            value={typeId || ""}
                            onChange={(e) => setTypeId(Number(e.target.value))}
                            className="w-full px-5 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 text-gray-800"
                        >
                            <option value="" disabled>Select a workout type</option>
                            {workoutTypes?.map((type) => (
                                <option key={type.id} value={type.id} className="bg-white">
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Description */}
                <div className="mb-6">
                    <label className="block text-gray-600 text-sm font-medium mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter description (min 10 chars)"
                        rows={4}
                        className="w-full px-5 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 placeholder-gray-400 text-gray-800 resize-none"
                    />
                </div>

                {/* Submit Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    onClick={handleSubmit}
                    disabled={createWorkoutMutation.isLoading}
                    className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-blue-400 text-white font-medium hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-md"
                >
                    {createWorkoutMutation.isLoading ? (
                        <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                    ) : (
                        "Create Workout"
                    )}
                </motion.button>
            </motion.div>
        </div>
    );
};

export default CreateWorkout;