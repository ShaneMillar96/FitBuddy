import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@shared/integration/instance";
import { QueryKeys } from "@/constants/query-keys";

export interface AnalysisResult {
    videoId: number;
    memberId: number;
    filePath: string;
    exerciseType: string;
    analysisResult?: string;
    createdDate?: string;
}

export const useExerciseAnalysis = () => {
    const queryClient = useQueryClient();

    const uploadVideo = useMutation({
        mutationFn: async ({ file, exerciseType }: { file: File; exerciseType: string }) => {
            const formData = new FormData();
            formData.append("videoFile", file);
            formData.append("exerciseType", exerciseType);
            const { data } = await axiosInstance.post("/analysis/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return data.videoId as number;
        },
        onSuccess: (videoId) => {
            queryClient.invalidateQueries([QueryKeys.ANALYSIS, videoId.toString()]);
        },
    });

    const getAnalysis = (videoId?: number) =>
        useQuery({
            queryKey: [QueryKeys.ANALYSIS, videoId?.toString()],
            queryFn: async ({ queryKey }) => {
                const id = queryKey[1];
                if (!id) throw new Error("Video ID is required");
                const { data } = await axiosInstance.get(`/analysis/${id}`);
                return data as AnalysisResult;
            },
            enabled: !!videoId,
        });

    return { uploadVideo, getAnalysis };
};