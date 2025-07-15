import axiosInstance from "@shared/integration/instance";
import { APIRoutes } from "@/constants/api-routes";
import { CreateWorkoutExercise } from "@/interfaces/categories";

export interface Workout {
    id: number;
    name: string;
    createdBy: string;
    createdById: number;
    workoutTypeId: number;
    workoutTypeName?: string;
    // CrossFit-specific fields
    categoryId?: number;
    categoryName?: string;
    subTypeId?: number;
    subTypeName?: string;
    estimatedDurationMinutes?: number;
    scoreTypeId?: number;
    scoreTypeName?: string;
    exercises?: CreateWorkoutExercise[];
    createdDate: string;
    modifiedDate?: string;
}

export interface CreateWorkout {
    name: string;
    typeId: number;
    // CrossFit-specific fields
    scoreTypeId?: number;
    difficultyLevel?: number;
    estimatedDurationMinutes?: number;
    exercises: CreateWorkoutExercise[];
    workoutTypeData?: string;
}

export interface WorkoutType {
    id: number;
    name: string;
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
                                  }: {
                                      pageSize?: number;
                                      pageNumber?: number;
                                      sortBy?: string;
                                      sortDirection?: string;
                                      search?: string;
                                  } = {}): Promise<PaginatedWorkoutsResponse> => {
    const { data } = await axiosInstance.get(APIRoutes.WORKOUTS, {
        params: {
            pageSize,
            pageNumber,
            sortBy,
            sortDirection,
            search
        },
        paramsSerializer: { indexes: null }
    });

    return data;
};

