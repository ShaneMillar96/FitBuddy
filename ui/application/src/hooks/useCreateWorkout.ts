import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@shared/integration/instance";
import { APIRoutes } from "@/constants/api-routes";
import { CreateWorkout } from "@/interfaces/workout";

export const useCreateWorkout = () => {
    return useMutation({
        mutationFn: async (newWorkout: CreateWorkout) => {
            const { data } = await axiosInstance.post(APIRoutes.WORKOUTS, newWorkout);
            return data;
        },
    });
};
