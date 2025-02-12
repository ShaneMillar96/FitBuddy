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

export const useWorkoutComments = (
    workoutId: string,
    pageNumber: number,
    pageSize: number = 10,
    sortBy: string = "createdDate",
    ascending: boolean = false,
    searchQuery: string = ""
) => {
    return useQuery({
        queryKey: [QueryKeys.WORKOUT_COMMENTS, workoutId, pageNumber, sortBy, ascending, searchQuery], // ✅ Include all pagination params
        queryFn: async () => {
            const { data } = await axiosInstance.get(APIRoutes.COMMENTS, {
                params: {
                    PageSize: pageSize,
                    PageNumber: pageNumber,
                    SortBy: sortBy,
                    Ascending: ascending,
                    SearchQuery: searchQuery
                }, // ✅ Matches `PaginationDto`
            });
            return data; // API should return `{ data: WorkoutComment[], totalCount: number }`
        },
        enabled: !!workoutId, // ✅ Prevents query from running if workoutId is undefined
        keepPreviousData: true, // ✅ Keeps previous data while fetching new pages
    });
};
