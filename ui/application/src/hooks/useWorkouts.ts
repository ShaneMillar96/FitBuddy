import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getWorkouts } from "@/interfaces/workout";
import { QueryKeys } from "@/constants/query-keys";

interface UseWorkoutsProps {
    pageSize?: number;
    sortBy?: string;
    sortDirection?: string;
    search?: string; // Changed from searchQuery to search
}

export const useWorkouts = ({
                                pageSize = 10,
                                sortBy = "",
                                sortDirection = "asc",
                                search = "", // Changed from searchQuery to search
                            }: UseWorkoutsProps) => {
    return useInfiniteQuery({
        queryKey: [QueryKeys.WORKOUTS, pageSize, sortBy, sortDirection, search],
        queryFn: ({ pageParam = 1 }) =>
            getWorkouts({ pageSize, pageNumber: pageParam, sortBy, sortDirection, search }),
        getNextPageParam: (lastPage, allPages) => {
            const totalFetched = allPages.reduce((acc, page) => acc + page.data.length, 0);
            return totalFetched < lastPage.totalCount ? allPages.length + 1 : undefined;
        },
        keepPreviousData: true,
        staleTime: 0,
        refetchOnWindowFocus: true,
    });
};