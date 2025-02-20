import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@shared/integration/instance";
import { APIRoutes } from "@/constants/api-routes";
import { toast } from "react-toastify";

interface RegisterPayload {
    username: string;
    email: string;
    password: string;
}

export const useRegister = () => {
    return useMutation({
        mutationFn: async (registerData: RegisterPayload) => {
            await axiosInstance.post(`${APIRoutes.ACCOUNTS}/register`, registerData);
        },
        onSuccess: () => {
            toast.success("Registration successful! Please log in.");
        },
        onError: () => {
            toast.error("Registration failed. Try again.");
        },
    });
};
