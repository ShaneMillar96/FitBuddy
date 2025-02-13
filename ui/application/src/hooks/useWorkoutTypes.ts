import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@shared/integration/instance";
import { APIRoutes } from "@/constants/api-routes";
import { QueryKeys } from "@/constants/query-keys";

interface WorkoutType {
    id: number;
    name: string;
}

export const useWorkoutTypes = () => {
    return useQuery({
        queryKey: [QueryKeys.WORKOUT_TYPES],
        queryFn: async () => {
            const { data } = await axiosInstance.get(APIRoutes.WORKOUT_TYPES);
            return data as WorkoutType[];
        },
    });
};
