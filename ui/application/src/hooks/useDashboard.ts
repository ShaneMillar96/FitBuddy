import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@shared/integration/instance";
import { QueryKeys } from "@/constants/query-keys";

interface DashboardData {
    workoutsToday: number;
    workoutsThisWeek: number;
    workoutsAllTime: number;
    totalComments: number;
    favoriteWorkoutType?: string;
    bestWorkoutResult?: {
        workoutId: number;
        workoutName: string;
        rank: number;
        result: string;
    };
    weeklyWorkoutCounts: { date: string; count: number }[];
}

export const useDashboard = () => {
    return useQuery({
        queryKey: [QueryKeys.DASHBOARD],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/dashboard");
            return data as DashboardData;
        },
        enabled: !!localStorage.getItem("token"),
    });
};

