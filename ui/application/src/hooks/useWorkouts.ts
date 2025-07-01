import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getWorkouts } from "@/interfaces/workout";
import { QUERY_KEYS } from "@/constants/query-keys";

interface UseWorkoutsProps {
    pageSize?: number;
    sortBy?: string;
    sortDirection?: string;
    search?: string;
    categoryIds?: number[];
    subTypeId?: number;
    minDifficultyLevel?: number;
    maxDifficultyLevel?: number;
    minDuration?: number;
    maxDuration?: number;
}

export const useWorkouts = ({
                                pageSize = 10,
                                sortBy = "",
                                sortDirection = "asc",
                                search = "",
                                categoryIds,
                                subTypeId,
                                minDifficultyLevel,
                                maxDifficultyLevel,
                                minDuration,
                                maxDuration,
                            }: UseWorkoutsProps = {}) => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.WORKOUTS, pageSize, sortBy, sortDirection, search, categoryIds, subTypeId, minDifficultyLevel, maxDifficultyLevel, minDuration, maxDuration],
        queryFn: ({ pageParam = 1 }) =>
            getWorkouts({ 
                pageSize, 
                pageNumber: pageParam, 
                sortBy, 
                sortDirection, 
                search, 
                categoryIds, 
                subTypeId, 
                minDifficultyLevel,
                maxDifficultyLevel,
                minDuration,
                maxDuration
            }),
        getNextPageParam: (lastPage, allPages) => {
            const totalFetched = allPages.reduce((acc, page) => acc + page.data.length, 0);
            return totalFetched < lastPage.totalCount ? allPages.length + 1 : undefined;
        },
        placeholderData: (previousData) => previousData,
        staleTime: 0,
        refetchOnWindowFocus: true,
    });
};

