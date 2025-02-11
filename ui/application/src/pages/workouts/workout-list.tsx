import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Workout } from "@/interfaces/workout";

const WorkoutList = () => {
    const [workouts, setWorkouts] = useState<Workout[]>([]);

    useEffect(() => {
        setWorkouts([
            {
                id: 1,
                name: "CrossFit WOD",
                description: "High-intensity functional movements",
                createdBy: "John Doe",
                createdDate: "2025-02-11T10:00:00Z",
            },
            {
                id: 2,
                name: "Strength Training",
                description: "Focused on building muscle strength",
                createdBy: "Jane Smith",
                createdDate: "2025-02-10T08:30:00Z",
            },
        ]);
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-blue-500 text-5xl font-extrabold mb-4">Workouts</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workouts.map((workout) => (
                    <div key={workout.id}
                         className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
                        <h2 className="text-blue-600 text-xl font-semibold">{workout.name}</h2>
                        <p className="text-gray-700">{workout.description}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            <strong>Created by:</strong> {workout.createdBy}
                        </p>
                        <p className="text-xs text-gray-400">
                            {format(new Date(workout.createdDate), "PPpp")}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkoutList;
