import { useState, useEffect, useRef } from "react";
import { useExerciseAnalysis, AnalysisResult } from "@/hooks/useExerciseAnalysis";
import { FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";

const Analysis = () => {
    const [file, setFile] = useState<File | null>(null);
    const [exerciseType, setExerciseType] = useState("");
    const [videoId, setVideoId] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false); 
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadVideo, getAnalysis } = useExerciseAnalysis();
    const analysisQuery = getAnalysis(videoId || undefined);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (!file || !exerciseType) {
            toast.error("Please select a video and enter an exercise type.");
            return;
        }
        setIsProcessing(true); 
        uploadVideo.mutate(
            { file, exerciseType },
            {
                onSuccess: (id) => {
                    setVideoId(id);
                    setFile(null);
                    setExerciseType("");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                },
                onError: (error) => {
                    toast.error(`Upload failed: ${(error as Error).message}`);
                    setIsProcessing(false); 
                },
            }
        );
    };

    useEffect(() => {
        if (videoId && !analysisQuery.isFetching && !analysisQuery.data) {
            analysisQuery.refetch();
        }
        if (videoId && analysisQuery.data) {
            setIsProcessing(false); 
        }
    }, [videoId, analysisQuery]);

    return (
        <div className="container mx-auto p-6 bg-black text-gray-300 border border-gray-700 rounded-lg shadow-lg">
            <h1 className="text-white text-4xl font-extrabold mb-6">AI Coach Analysis</h1>

            <div className="mb-6">
                <label className="block text-gray-400 mb-2">Exercise Type</label>
                <input
                    type="text"
                    value={exerciseType}
                    onChange={(e) => setExerciseType(e.target.value)}
                    placeholder="e.g., Squat Snatch"
                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg"
                />
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
                disabled={isProcessing || !file || !exerciseType}
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
                            ? JSON.parse(analysisQuery.data.analysisResult).feedback.join(", ")
                            : "No feedback available."}
                    </p>
                    <video src={analysisQuery.data.filePath} controls className="mt-4 w-full max-w-md" />
                </div>
            )}
        </div>
    );
};

export default Analysis;