import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@shared/integration/instance";
import { APIRoutes } from "@/constants/api-routes";
import { toast } from "react-toastify";

interface LoginPayload {
    username: string;
    password: string;
}

export const useLogin = () => {
    return useMutation({
        mutationFn: async (loginData: LoginPayload) => {
            const { data } = await axiosInstance.post(`${APIRoutes.ACCOUNTS}/login`, loginData);
            return data;
        },
        onSuccess: (data) => {
            localStorage.setItem("token", data.token); 
            toast.success("Login successful!");
        },
        onError: () => {
            toast.error("Invalid login attempt.");
        },
    });
};
