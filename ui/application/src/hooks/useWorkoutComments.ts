import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@shared/integration/instance";
import { APIRoutes } from "@/constants/api-routes";
import { QueryKeys } from "@/constants/query-keys";

interface WorkoutComment {
    id: number;
    description: string;
    member: {
        id: number;
        username: string;
    };
    createdDate: string;
}

export const useWorkoutComments = (workoutId: string, page: number, pageSize: number = 10) => {
    return useQuery({
        queryKey: [QueryKeys.WORKOUT_COMMENTS, workoutId, page], 
        queryFn: async () => {
            const { data } = await axiosInstance.get(APIRoutes.COMMENTS, {
                params: { workoutId, page, pageSize }, 
            });
            return data; 
        },
        enabled: !!workoutId, 
        keepPreviousData: true, 
    });
};
