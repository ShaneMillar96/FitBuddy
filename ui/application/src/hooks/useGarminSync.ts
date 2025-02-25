import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@shared/integration/instance";

interface GarminActivity {
    activityId: string;
    name: string;
    duration: number;
    avgHeartRate: number;
    caloriesBurned: number;
    startTime: string;
}

export const useGarminAuth = () => {
    return useMutation({
        mutationFn: async () => {
            const { data } = await axiosInstance.get("/account/garmin-auth");
            return data;
        },
    });
};

export const useGarminActivities = (accessToken: string) => {
    return useQuery({
        queryKey: ["garmin-activities", accessToken],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/account/garmin-activities", {
                params: { accessToken },
            });
            return data as GarminActivity[];
        },
        enabled: !!accessToken,
    });
};