import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getWorkouts } from "@/interfaces/workout";
import { QUERY_KEYS } from "@/constants/query-keys";

interface UseWorkoutsProps {
    pageSize?: number;
    sortBy?: string;
    sortDirection?: string;
    search?: string;
}

export const useWorkouts = ({
                                pageSize = 10,
                                sortBy = "",
                                sortDirection = "asc",
                                search = "",
                            }: UseWorkoutsProps = {}) => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.WORKOUTS, pageSize, sortBy, sortDirection, search],
        queryFn: ({ pageParam = 1 }) =>
            getWorkouts({ 
                pageSize, 
                pageNumber: pageParam, 
                sortBy, 
                sortDirection, 
                search
            }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const totalFetched = allPages.reduce((acc, page) => acc + (page as any).data.length, 0);
            return totalFetched < (lastPage as any).totalCount ? allPages.length + 1 : undefined;
        },
        placeholderData: (previousData) => previousData,
        staleTime: 0,
        refetchOnWindowFocus: true,
    });
};

