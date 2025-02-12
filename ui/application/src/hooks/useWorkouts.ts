import { useQuery } from "@tanstack/react-query";
import { getWorkouts } from "@/interfaces/workout";
import { QueryKeys } from "@/constants/query-keys";

interface UseWorkoutsProps {
    pageSize?: number;
    pageNumber?: number;
    sortBy?: string;
    sortDirection?: string;
    search?: string;
}

export const useWorkouts = ({
                                pageSize = 10,
                                pageNumber = 1,
                                sortBy = "",
                                sortDirection = "asc",
                                search = ""
                            }: UseWorkoutsProps) => {
    return useQuery({
        queryKey: [QueryKeys.WORKOUTS, pageSize, pageNumber, sortBy, sortDirection, search],
        queryFn: () => getWorkouts({ pageSize, pageNumber, sortBy, sortDirection, search }),
        keepPreviousData: true,
        refetchOnWindowFocus: true,
        staleTime: 30000, 
    });
};
