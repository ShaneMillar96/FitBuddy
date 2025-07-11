import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@shared/integration/instance";
import { QueryKeys } from "@/constants/query-keys";

export interface ScoreType {
    id: number;
    name: string;
    description?: string;
    createdDate?: string;
}

export const useScoreTypes = () => {
    return useQuery({
        queryKey: [QueryKeys.SCORE_TYPES],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/workouts/score-types");
            return data as ScoreType[];
        },
    });
};