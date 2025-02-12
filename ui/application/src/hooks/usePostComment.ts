import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@shared/integration/instance";
import { APIRoutes } from "@/constants/api-routes";
import { QueryKeys } from "@/constants/query-keys";

interface PostCommentPayload {
    workoutId: string;
    comment: string;
}

export const usePostComment = () => {
    const queryClient = useQueryClient(); 

    return useMutation({
        mutationFn: async ({ workoutId, comment }: PostCommentPayload) => {
            await axiosInstance.post(APIRoutes.COMMENTS, { workoutId, comment });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries([QueryKeys.WORKOUT_COMMENTS, variables.workoutId]);
        },
    });
};
