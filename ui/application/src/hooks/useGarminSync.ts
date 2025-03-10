import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@shared/integration/instance";
import { useEffect } from "react";

// GarminActivity interface
export interface GarminActivity {
    activityId: string;
    name: string;
    duration: number;
    avgHeartRate: number;
    caloriesBurned: number;
    startTime: string;
}

export const useGarminSync = () => {
    const initiateGarminAuth = useMutation({
        mutationFn: async () => {
            window.location.href = "/account/garmin-auth";
        },
    });

    const fetchGarminActivities = useQuery({
        queryKey: ["garmin-activities"],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/account/garmin-activities");
            return data as GarminActivity[];
        },
        enabled: false,
    });

    const handleGarminCallback = async (code: string) => {
        const { data } = await axiosInstance.get(`/account/garmin-callback?code=${code}`);
        return data.accessToken as string;
    };

    return {
        initiateGarminAuth,
        fetchGarminActivities,
        handleGarminCallback,
    };
};