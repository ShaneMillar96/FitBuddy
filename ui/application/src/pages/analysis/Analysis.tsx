import { useState, useEffect, useRef } from "react";
import { useExerciseAnalysis, AnalysisResult } from "@/hooks/useExerciseAnalysis";
import { useExerciseTypes } from "@/hooks/useExerciseTypes";
import { FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // For animations

const Analysis = () => {
    const [file, setFile] = useState<File | null>(null);
    const [exerciseTypeId, setExerciseTypeId] = useState<number | null>(null);
    const [videoId, setVideoId] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadVideo, getAnalysis } = useExerciseAnalysis();
    const analysisQuery = getAnalysis(videoId || undefined);
    const { data: exerciseTypes, isLoading, isError, error } = useExerciseTypes();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setVideoId(null);
            setIsProcessing(false);
        }
    };

    const handleUpload = () => {
        if (!file || !exerciseTypeId) {
            toast.error("Please select a video and exercise type.");
            return;
        }
        setIsProcessing(true);
        uploadVideo.mutate(
            { file, exerciseTypeId },
            {
                onSuccess: (id) => {
                    setVideoId(id);
                    setFile(null);
                    setExerciseTypeId(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                    setIsProcessing(false);
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

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6 lg:p-10">
            {/* Header Section */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    AI Coach Analysis
                </h1>
            </motion.div>

            {/* Exercise Type Selection */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-8"
            >
                <label className="block text-gray-400 text-lg mb-2">Select Exercise Type</label>
                {isLoading ? (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-400 text-center py-4"
                    >
                        Loading exercise types...
                    </motion.p>
                ) : isError ? (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-center py-4"
                    >
                        Error: {(error as Error).message}
                    </motion.p>
                ) : (
                    <select
                        value={exerciseTypeId || ""}
                        onChange={(e) => setExerciseTypeId(parseInt(e.target.value, 10))}
                        className="w-full px-5 py-3 bg-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                    >
                        <option value="" disabled>Select Exercise Type</option>
                        {exerciseTypes?.map((type) => (
                            <option key={type.id} value={type.id} className="bg-gray-800">
                                {type.name}
                            </option>
                        ))}
                    </select>
                )}
            </motion.div>

            {/* Video Upload */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
            >
                <label className="block text-gray-400 text-lg mb-2">Upload Video</label>
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="w-full px-5 py-3 bg-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 file:bg-gray-800 file:text-white file:border-none file:rounded-xl file:px-4 file:py-2 file:cursor-pointer hover:file:bg-gray-700"
                />
            </motion.div>

            {/* Analyze Button */}
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                onClick={handleUpload}
                disabled={isProcessing || !file || !exerciseTypeId}
                className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-lg flex items-center justify-center mb-8"
            >
                <FaUpload className="mr-2" /> {isProcessing ? "Processing..." : "Analyze Video"}
            </motion.button>

            {/* Processing Feedback */}
            {isProcessing && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-400 flex items-center justify-center mb-4"
                >
                    <span className="animate-spin mr-2 inline-block w-5 h-5 border-2 border-t-blue-500 border-gray-700 rounded-full"></span>
                    Analyzing...
                </motion.p>
            )}

            {/* Error Messages */}
            {(uploadVideo.error || analysisQuery.error) && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-center mb-4"
                >
                    Error: {(uploadVideo.error as Error)?.message || (analysisQuery.error as Error)?.message}
                </motion.p>
            )}

            {/* Analysis Result */}
            {analysisQuery.data && !isProcessing && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6 shadow-lg"
                >
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                        Analysis Result
                    </h2>
                    <p className="text-gray-300 mb-4">
                        {analysisQuery.data.analysisResult
                            ? JSON.parse(analysisQuery.data.analysisResult).feedback.join(", ") +
                            ` (Reps: ${JSON.parse(analysisQuery.data.analysisResult).reps || 0})`
                            : "No feedback available."}
                    </p>
                    <video
                        src={`${apiBaseUrl}${analysisQuery.data.filePath}`}
                        controls
                        className="w-full max-w-2xl rounded-xl border border-gray-700/50"
                        onError={(e) => console.error("Video load error:", e)}
                    />
                </motion.div>
            )}
        </div>
    );
};

export default Analysis;