import { useEffect, useState } from "react";
import { Workout } from "../interfaces/workout";
import { ApiResponse } from "../interfaces/api";

const useWorkouts = () => {
    const [workouts, setWorkouts] = useState<Workout[]>([]);

    useEffect(() => {
        fetch("/api/workouts") // Replace with actual API endpoint
            .then((res) => res.json())
            .then((data: ApiResponse<Workout[]>) => {
                if (data.success) {
                    setWorkouts(data.data);
                }
            })
            .catch((error) => console.error("Error fetching workouts", error));
    }, []);

    return workouts;
};

export default useWorkouts;
