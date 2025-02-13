import { useState } from "react";
import { useWorkoutTypes } from "@/hooks/useWorkoutTypes";
import { useCreateWorkout } from "@/hooks/useCreateWorkout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
                    setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds
                },
                onError: () => {
                    toast.error("Failed to create workout. Please try again.");
                },
            }
        );
    };

    return (
        <div className="container mx-auto p-6 bg-black text-gray-300 border border-gray-700 rounded-lg shadow-lg">
            <h1 className="text-white text-4xl font-extrabold">Create Workout</h1>

            <div className="mt-4">
                <label className="block text-gray-400">Workout Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
            </div>

            <div className="mt-4">
                <label className="block text-gray-400">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
            </div>

            <div className="mt-4">
                <label className="block text-gray-400">Workout Type</label>
                {typesLoading ? (
                    <p className="text-gray-500">Loading workout types...</p>
                ) : typesError ? (
                    <p className="text-red-500">Failed to load workout types.</p>
                ) : (
                    <select
                        value={typeId || ""}
                        onChange={(e) => setTypeId(Number(e.target.value))}
                        className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        <option value="" disabled>
                            Select a workout type
                        </option>
                        {workoutTypes?.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <div className="mt-6">
                <button
                    onClick={handleSubmit}
                    disabled={createWorkoutMutation.isLoading}
                    className={`w-full px-4 py-2 rounded-lg transition ${
                        createWorkoutMutation.isLoading
                            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                            : "bg-gray-300 text-black hover:bg-white"
                    }`}
                >
                    {createWorkoutMutation.isLoading ? "Creating..." : "Create Workout"}
                </button>
            </div>
        </div>
    );
};

export default CreateWorkout;
