import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getWorkouts } from "@/interfaces/workout";
import { QUERY_KEYS } from "@/constants/query-keys";

interface UseWorkoutsProps {
    pageSize?: number;
    sortBy?: string;
    sortDirection?: string;
    search?: string;
    categoryId?: number;
    subTypeId?: number;
    difficultyLevel?: number;
}

export const useWorkouts = ({
                                pageSize = 10,
                                sortBy = "",
                                sortDirection = "asc",
                                search = "",
                                categoryId,
                                subTypeId,
                                difficultyLevel,
                            }: UseWorkoutsProps = {}) => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.WORKOUTS, pageSize, sortBy, sortDirection, search, categoryId, subTypeId, difficultyLevel],
        queryFn: ({ pageParam = 1 }) =>
            getWorkouts({ 
                pageSize, 
                pageNumber: pageParam, 
                sortBy, 
                sortDirection, 
                search, 
                categoryId, 
                subTypeId, 
                difficultyLevel 
            }),
        getNextPageParam: (lastPage, allPages) => {
            const totalFetched = allPages.reduce((acc, page) => acc + page.data.length, 0);
            return totalFetched < lastPage.totalCount ? allPages.length + 1 : undefined;
        },
        keepPreviousData: true,
        staleTime: 0,
        refetchOnWindowFocus: true,
    });
};