import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@shared/integration/instance";
import { APIRoutes } from "@/constants/api-routes";
import { QueryKeys } from "@/constants/query-keys";
import { toast } from "react-toastify";

interface PostCommentPayload {
    workoutId: string;
    comment: string;
}

export const usePostComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ workoutId, comment }: PostCommentPayload) => {
            const response = await axiosInstance.post(APIRoutes.COMMENTS, { workoutId, comment });
            return response.data; // Return the response data if it includes the new comment
        },
        onSuccess: (data, variables) => {
            toast.success("Comment posted successfully!");
            // Invalidate the specific workout comments query
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.WORKOUT_COMMENTS, variables.workoutId, { page: variables.page || 1, limit: 10 }],
            });
        },
        onError: (error) => {
            toast.error("Failed to post comment. Please try again.");
            console.error("Post comment error:", error);
        },
    });
};