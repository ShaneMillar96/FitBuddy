import { useState, useEffect, useRef } from "react";
import { useExerciseAnalysis, AnalysisResult } from "@/hooks/useExerciseAnalysis";
import { useExerciseTypes } from "@/hooks/useExerciseTypes";
import { FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";

const Analysis = () => {
    const [file, setFile] = useState<File | null>(null);
    const [exerciseTypeId, setExerciseTypeId] = useState<number | null>(null);
    const [videoId, setVideoId] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false); // Reset this state for new uploads
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadVideo, getAnalysis } = useExerciseAnalysis();
    const analysisQuery = getAnalysis(videoId || undefined);
    const { data: exerciseTypes, isLoading, isError, error } = useExerciseTypes();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            // Reset videoId and isProcessing when a new file is selected to ensure fresh state
            setVideoId(null);
            setIsProcessing(false);
        }
    };

    const handleUpload = () => {
        if (!file || !exerciseTypeId) {
            toast.error("Please select a video and exercise type.");
            return;
        }
        setIsProcessing(true); // Set processing state immediately
        uploadVideo.mutate(
            { file, exerciseTypeId },
            {
                onSuccess: (id) => {
                    setVideoId(id);
                    setFile(null);
                    setExerciseTypeId(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                    setIsProcessing(false); // Ensure processing state is cleared on success
                },
                onError: (error) => {
                    toast.error(`Upload failed: ${(error as Error).message}`);
                    setIsProcessing(false); // Ensure processing state is cleared on error
                },
            }
        );
    };

    useEffect(() => {
        // Refetch analysis only if videoId exists and data isn’t already loaded
        if (videoId && !analysisQuery.isFetching && !analysisQuery.data) {
            analysisQuery.refetch();
        }
        // Reset isProcessing when analysis is complete and data is available
        if (videoId && analysisQuery.data) {
            setIsProcessing(false);
        }
    }, [videoId, analysisQuery]);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

    return (
        <div className="container mx-auto p-6 bg-black text-gray-300 border border-gray-700 rounded-lg shadow-lg">
            <h1 className="text-white text-4xl font-extrabold mb-6">AI Coach Analysis</h1>

            <div className="mb-6">
                <label className="block text-gray-400 mb-2">Exercise Type</label>
                {isLoading ? (
                    <p className="text-gray-400">Loading exercise types...</p>
                ) : isError ? (
                    <p className="text-red-500">Error: {(error as Error).message}</p>
                ) : (
                    <select
                        value={exerciseTypeId || ""}
                        onChange={(e) => setExerciseTypeId(parseInt(e.target.value, 10))}
                        className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg"
                    >
                        <option value="" disabled>Select Exercise Type</option>
                        {exerciseTypes?.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <div className="mb-6">
                <label className="block text-gray-400 mb-2">Upload Video</label>
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg"
                />
            </div>

            <button
                onClick={handleUpload}
                disabled={isProcessing || !file || !exerciseTypeId}
                className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
                <FaUpload className="mr-2" /> {isProcessing ? "Processing..." : "Analyze Video"}
            </button>

            {isProcessing && (
                <p className="text-gray-400 flex items-center">
                    <span className="animate-spin mr-2">⌀</span> Analyzing...
                </p>
            )}
            {uploadVideo.error && <p className="text-red-500">Error: {(uploadVideo.error as Error).message}</p>}
            {analysisQuery.error && <p className="text-red-500">Error: {(analysisQuery.error as Error).message}</p>}
            {analysisQuery.data && !isProcessing && (
                <div className="bg-gray-900 p-4 border border-gray-700 rounded-lg">
                    <h2 className="text-white text-2xl font-bold mb-2">Analysis Result</h2>
                    <p className="text-gray-300">
                        {analysisQuery.data.analysisResult
                            ? JSON.parse(analysisQuery.data.analysisResult).feedback.join(", ") +
                            ` (Reps: ${JSON.parse(analysisQuery.data.analysisResult).reps || 0})`
                            : "No feedback available."}
                    </p>
                    <video
                        src={`${apiBaseUrl}${analysisQuery.data.filePath}`}
                        controls
                        className="mt-4 w-full max-w-md"
                        onError={(e) => console.error("Video load error:", e)}
                    />
                </div>
            )}
        </div>
    );
};

export default Analysis;