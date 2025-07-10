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
    // CrossFit-focused simplified fields
    workoutsCreated: number;
    workoutsCompleted: number;
    favoriteWorkouts: number;
    totalMinutesExercised: number;
    currentStreak: number;
    personalBests: number;
    weeklyGoal: number;
    weeklyProgress: number;
    weeklyCompletionPercentage: number;
    trendingMetrics: any[];
    categoryBreakdown: any[];
    recentAchievements: any[];
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

