import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from "@shared/integration/instance";
import { QueryKeys } from "@/constants/query-keys";


export interface AnalysisResult {
    id: number;
    filePath: string;
    analysisResult: string;
    memberId: number;
    exerciseTypeId: number; // Updated to use ID
    createdDate: string;
}

interface UploadParams {
    file: File;
    exerciseTypeId: number; // Updated to use ID
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const useExerciseAnalysis = () => {
    const queryClient = useQueryClient();

    const uploadVideo = useMutation({
        mutationFn: async ({ file, exerciseTypeId }: UploadParams) => {
            const formData = new FormData();
            formData.append('videoFile', file);
            formData.append('exerciseTypeId', exerciseTypeId.toString());

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