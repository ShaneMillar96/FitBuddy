import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@shared/integration/instance";
import { APIRoutes } from "@/constants/api-routes";

interface CreateWorkoutPayload {
    name: string;
    description: string;
    typeId: number;
}

export const useCreateWorkout = () => {
    return useMutation({
        mutationFn: async (newWorkout: CreateWorkoutPayload) => {
            const { data } = await axiosInstance.post(APIRoutes.WORKOUTS, newWorkout);
            return data;
        },
    });
};
