import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@shared/integration/instance";
import { APIRoutes } from "@/constants/api-routes";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
interface AddWorkoutResultPayload {
    workoutId: number;
    result: string;
}

export const useAddWorkoutResult = () => {
    const queryClient = useQueryClient(); 

    return useMutation({
        mutationFn: async ({ workoutId, result }: AddWorkoutResultPayload) => {
            await axiosInstance.post(`${APIRoutes.WORKOUTS}/${workoutId}/results`, { workoutId, result });
        },
        onSuccess: (_, variables) => {
            toast.success("Workout result logged successfully!");
            queryClient.invalidateQueries(["workout-results", variables.workoutId]); 
        },
        onError: (error) => {
            if (isAxiosError(error) && error.response?.status === 409) {
                toast.error("You have already logged a result for this workout.");
            } else {
                toast.error("Failed to add result. Please try again.");
            }
        },
    });
};
