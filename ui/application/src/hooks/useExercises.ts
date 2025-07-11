import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@shared/integration/instance";
import { QueryKeys } from "@/constants/query-keys";

export interface Exercise {
    id: number;
    name: string;
    description?: string;
    instructions?: string;
    createdDate?: string;
}

export const useExercises = () => {
    return useQuery({
        queryKey: [QueryKeys.EXERCISES],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/workouts/exercises");
            return data as Exercise[];
        },
    });
};

export const useSearchExercises = (searchTerm: string, enabled = true) => {
    return useQuery({
        queryKey: [QueryKeys.EXERCISES, "search", searchTerm],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/workouts/exercises?search=${encodeURIComponent(searchTerm)}`);
            return data as Exercise[];
        },
        enabled: enabled && searchTerm.length >= 2,
    });
};