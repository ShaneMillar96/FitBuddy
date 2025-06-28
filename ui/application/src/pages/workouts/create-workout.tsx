import { useState } from "react";
import { useWorkoutTypes } from "@/hooks/useWorkoutTypes";
import { useCreateWorkout } from "@/hooks/useCreateWorkout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import CategorySelector from "@/components/workout/CategorySelector";
import WorkoutBuilder from "@/components/workout/WorkoutBuilder";
import { CreateWorkoutExercise } from "@/interfaces/categories";

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
    
    // Enhanced state for new features
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
    const [selectedSubType, setSelectedSubType] = useState<number | undefined>();
    const [difficultyLevel, setDifficultyLevel] = useState<number | undefined>();
    const [estimatedDuration, setEstimatedDuration] = useState<number | undefined>();
    const [equipmentNeeded] = useState<string[]>([]);
    const [exercises, setExercises] = useState<CreateWorkoutExercise[]>([]);

    const handleSubmit = () => {
        if (!name.trim() || name.length < 3 || name.length > 25) {
            toast.error("Name should be between 3 and 25 characters long.");
            return;
        }
        if (!description.trim() || description.length < 10) {
            toast.error("Description should be at least 10 characters long.");
            return;
        }
        if (!selectedCategory) {
            toast.error("Please select a workout category.");
            return;
        }
        
        // Use a default type ID since we're no longer requiring legacy type selection
        const finalTypeId = typeId || 1; // Default to first workout type if none selected

        const workoutData = {
            name,
            description,
            typeId: finalTypeId,
            categoryId: selectedCategory,
            subTypeId: selectedSubType,
            difficultyLevel,
            estimatedDurationMinutes: estimatedDuration,
            equipmentNeeded,
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
                <h1 className="text-4xl font-semibold text-gray-900">Create Workout</h1>
                <p className="text-gray-500 mt-2">Design a new workout to share with the community.</p>
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
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Basic Information</h2>
                    
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

                    {/* Additional Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Difficulty Level */}
                        <div>
                            <label className="block text-gray-600 text-sm font-medium mb-2">Difficulty Level</label>
                            <select
                                value={difficultyLevel || ""}
                                onChange={(e) => setDifficultyLevel(e.target.value ? Number(e.target.value) : undefined)}
                                className="w-full px-5 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 text-gray-800"
                            >
                                <option value="">Select difficulty</option>
                                <option value="1">1 - Beginner</option>
                                <option value="2">2 - Easy</option>
                                <option value="3">3 - Moderate</option>
                                <option value="4">4 - Hard</option>
                                <option value="5">5 - Expert</option>
                            </select>
                        </div>

                        {/* Estimated Duration */}
                        <div>
                            <label className="block text-gray-600 text-sm font-medium mb-2">Estimated Duration (minutes)</label>
                            <input
                                type="number"
                                min="1"
                                max="600"
                                value={estimatedDuration || ""}
                                onChange={(e) => setEstimatedDuration(e.target.value ? Number(e.target.value) : undefined)}
                                placeholder="e.g., 45"
                                className="w-full px-5 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 placeholder-gray-400 text-gray-800"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Category Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100"
                >
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Workout Category</h2>
                    <CategorySelector
                        selectedCategory={selectedCategory}
                        selectedSubType={selectedSubType}
                        onCategorySelect={setSelectedCategory}
                        onSubTypeSelect={setSelectedSubType}
                    />
                </motion.div>


                {/* Workout Builder */}
                {selectedCategory && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100"
                    >
                        <WorkoutBuilder
                            categoryId={selectedCategory}
                            exercises={exercises}
                            onExercisesChange={setExercises}
                        />
                    </motion.div>
                )}

                {/* Submit Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
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