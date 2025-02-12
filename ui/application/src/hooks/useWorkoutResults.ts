import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@shared/integration/instance";
import { APIRoutes } from "@/constants/api-routes";
import { QueryKeys } from "@/constants/query-keys";

interface WorkoutResult {
    id: number;
    user: { id: number; username: string };
    score: string;
    createdDate: string;
}

export const useWorkoutResults = (workoutId: string) => {
    return useQuery({
        queryKey: [QueryKeys.WORKOUT_RESULTS, workoutId],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`${APIRoutes.WORKOUTS}/${workoutId}/results`);
            return data;
        },
        enabled: !!workoutId, 
    });
};
