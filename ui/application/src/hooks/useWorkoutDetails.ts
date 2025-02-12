import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@shared/integration/instance";
import { APIRoutes } from "@/constants/api-routes";
import { QueryKeys } from "@/constants/query-keys";

export const useWorkoutDetails = (id: string) => {
    return useQuery({
        queryKey: [QueryKeys.WORKOUT_DETAILS, id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`${APIRoutes.WORKOUTS}/${id}`);
            return data;
        },
        enabled: !!id, 
    });
};
