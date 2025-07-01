import axiosInstance from "@shared/integration/instance";
import { APIRoutes } from "@/constants/api-routes";
import { CreateWorkoutExercise } from "@/interfaces/categories";

export interface Workout {
    id: number;
    name: string;
    description: string;
    createdBy: string;
    createdById: number;
    workoutTypeId: number;
    workoutTypeName?: string;
    // Enhanced fields
    categoryId?: number;
    categoryName?: string;
    subTypeId?: number;
    subTypeName?: string;
    difficultyLevel?: number;
    estimatedDurationMinutes?: number;
    equipmentNeeded?: string[];
    scoreTypeId?: number;
    scoreTypeName?: string;
    createdDate: string;
    modifiedDate?: string;
}

export interface CreateWorkout {
    name: string;
    description: string;
    typeId: number;
    // Enhanced fields
    categoryId?: number;
    subTypeId?: number;
    difficultyLevel?: number;
    estimatedDurationMinutes?: number;
    equipmentNeeded?: string[];
    exercises: CreateWorkoutExercise[];
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
                                      search = "",
                                      categoryId,
                                      subTypeId,
                                      difficultyLevel
                                  }: {
                                      pageSize?: number;
                                      pageNumber?: number;
                                      sortBy?: string;
                                      sortDirection?: string;
                                      search?: string;
                                      categoryId?: number;
                                      subTypeId?: number;
                                      difficultyLevel?: number;
                                  } = {}): Promise<PaginatedWorkoutsResponse> => {
    const { data } = await axiosInstance.get(APIRoutes.WORKOUTS, {
        params: {
            pageSize,
            pageNumber,
            sortBy,
            sortDirection,
            search,
            categoryId,
            subTypeId,
            difficultyLevel,
        },
        paramsSerializer: { indexes: null }
    });

    return data;
};
