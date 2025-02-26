import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@shared/integration/instance";
import { APIRoutes } from "@/constants/api-routes";
import { QueryKeys } from "@/constants/query-keys";

interface ExerciseType {
    id: number;
    name: string;
}

export const useExerciseTypes = () => {
    return useQuery({
        queryKey: [QueryKeys.EXERCISE_TYPES],
        queryFn: async () => {
            const { data } = await axiosInstance.get(APIRoutes.EXERCISE_TYPES);
            return data as ExerciseType[];
        },
    });
};
