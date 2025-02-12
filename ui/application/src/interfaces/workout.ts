import axiosInstance from "@shared/integration/instance";
import { APIRoutes } from "@/constants/api-routes";

export interface Workout {
    id: string;
    name: string;
    description: string;
    createdBy: string;
}

interface PaginatedWorkoutsResponse {
    data: Workout[];
    totalCount: number;
}

export const getWorkouts = async ({
                                      pageSize = 10,
                                      pageNumber = 1,
                                      sortBy = "",
                                      sortDirection = "asc",
                                      search = ""
                                  }): Promise<PaginatedWorkoutsResponse> => {
    const { data } = await axiosInstance.get(APIRoutes.WORKOUTS, {
        params: {
            pageSize,
            pageNumber,
            sortBy,
            sortDirection,
            search,
        },
        paramsSerializer: { indexes: null }
    });

    return data;
};
