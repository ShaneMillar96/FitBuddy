import { useState, useEffect } from "react";
import { useWorkoutResults } from "@/hooks/useWorkoutResults";
import { useAddWorkoutResult } from "@/hooks/useAddWorkoutResult";
import { useGarminSync, GarminActivity } from "@/hooks/useGarminSync";
import { FaSync, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion"; // For animations

interface ResultsProps {
    workoutId: string;
    scoreType: string;
}

const Results = ({ workoutId, scoreType }: ResultsProps) => {
    const { data: results, isLoading, error, refetch } = useWorkoutResults(workoutId);
    const addResultMutation = useAddWorkoutResult();
    const [isAddingResult, setIsAddingResult] = useState(false);
    const [resultText, setResultText] = useState("");
    const { initiateGarminAuth, fetchGarminActivities, handleGarminCallback } = useGarminSync();

    const handleSubmitResult = (garminData?: GarminActivity) => {
        if (!resultText.trim() && !garminData) return;

        addResultMutation.mutate(
            {
                workoutId: Number(workoutId),
                result: resultText || garminData?.name || "",
                duration: garminData?.duration,
                avgHeartRate: garminData?.avgHeartRate,
                caloriesBurned: garminData?.caloriesBurned,
                garminActivityId: garminData?.activityId,
            },
            {
                onSuccess: () => {
                    setResultText("");
                    setIsAddingResult(false);
                    refetch(); // Refetch to update the list immediately
                },
            }
        );
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        if (code) {
            handleGarminCallback(code)
                .then(() => {
                    fetchGarminActivities.refetch();
                    window.history.replaceState({}, document.title, window.location.pathname);
                })
                .catch((err) => console.error("Garmin callback error:", err));
        }
    }, [handleGarminCallback, fetchGarminActivities]);

    // Refetch on mount to ensure immediate data load
    useEffect(() => {
        refetch();
    }, [workoutId, refetch]);

    // Skeleton for loading state
    const SkeletonRow = () => (
        <motion.tr
            className="bg-gray-900/50 animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {[...Array(7)].map((_, index) => (
                <td key={index} className="p-4 border-b border-gray-700/50">
                    <div className="h-4 bg-gray-700 rounded w-full"></div>
                </td>
            ))}
        </motion.tr>
    );

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full"
            >
                <table className="w-full text-left border-collapse border border-gray-700/50 rounded-xl overflow-hidden">
                    <thead className="bg-gray-900/50 text-gray-300">
                    <tr>
                        <th className="p-4 border-b border-gray-700/50">Rank</th>
                        <th className="p-4 border-b border-gray-700/50">User</th>
                        <th className="p-4 border-b border-gray-700/50">{scoreType}</th>
                        <th className="p-4 border-b border-gray-700/50">Duration</th>
                        <th className="p-4 border-b border-gray-700/50">Avg HR</th>
                        <th className="p-4 border-b border-gray-700/50">Calories</th>
                        <th className="p-4 border-b border-gray-700/50">Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {[...Array(3)].map((_, index) => (
                        <SkeletonRow key={index} />
                    ))}
                    </tbody>
                </table>
            </motion.div>
        );
    }
    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-center py-6"
            >
                Failed to load results. {error.message || "Please try again."}
            </motion.div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    Leaderboard
                </h2>
                <button
                    onClick={() => setIsAddingResult(true)}
                    className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white hover:scale-105 transition-all duration-300 shadow-lg"
                >
                    <FaPlus /> Add Result
                </button>
            </div>

            {isAddingResult ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6 shadow-lg"
                >
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                        Add Your Result
                    </h2>

                    {/* Uncomment if Garmin Sync is needed */}
                    {/* <button
                        onClick={() => initiateGarminAuth.mutate()}
                        disabled={initiateGarminAuth.isLoading}
                        className="mb-4 px-5 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 flex items-center transition-all duration-300"
                    >
                        <FaSync className="mr-2" /> Sync with Garmin
                    </button> */}

                    {fetchGarminActivities.data && (
                        <select
                            onChange={(e) => {
                                const activity = fetchGarminActivities.data.find((a) => a.activityId === e.target.value);
                                if (activity) handleSubmitResult(activity);
                            }}
                            className="w-full px-5 py-3 mb-4 bg-gray-800/50 text-white rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                        >
                            <option value="">Select a Garmin Activity</option>
                            {fetchGarminActivities.data.map((a) => (
                                <option key={a.activityId} value={a.activityId}>
                                    {a.name} ({new Date(a.startTime).toLocaleDateString()})
                                </option>
                            ))}
                        </select>
                    )}

                    <div className="flex space-x-4 items-center">
                        {scoreType === "Time" ? (
                            <input
                                type="text"
                                value={resultText}
                                onChange={(e) => setResultText(e.target.value)}
                                placeholder="mm:ss"
                                pattern="[0-5]?[0-9]:[0-5][0-9]"
                                className="w-full px-5 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 placeholder-gray-400"
                            />
                        ) : (
                            <div className="flex items-center space-x-2 w-full">
                                <input
                                    type="number"
                                    value={resultText}
                                    onChange={(e) => setResultText(e.target.value)}
                                    placeholder="Total Reps"
                                    className="w-full px-5 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 placeholder-gray-400"
                                />
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex space-x-4">
                        <button
                            onClick={() => handleSubmitResult()}
                            disabled={addResultMutation.isLoading}
                            className={`px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-lg ${
                                addResultMutation.isLoading ? "animate-pulse" : ""
                            }`}
                        >
                            {addResultMutation.isLoading ? (
                                <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                            ) : (
                                "Submit"
                            )}
                        </button>
                        <button
                            onClick={() => setIsAddingResult(false)}
                            className="px-5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 transition-all duration-300"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.05 },
                        },
                    }}
                >
                    {results?.data.length > 0 ? (
                        <table className="w-full text-left border-collapse border border-gray-700/50 rounded-xl overflow-hidden">
                            <thead className="bg-gray-900/50 text-gray-300">
                            <tr>
                                <th className="p-4 border-b border-gray-700/50">Rank</th>
                                <th className="p-4 border-b border-gray-700/50">User</th>
                                <th className="p-4 border-b border-gray-700/50">{scoreType}</th>
                                <th className="p-4 border-b border-gray-700/50">Duration</th>
                                <th className="p-4 border-b border-gray-700/50">Avg HR</th>
                                <th className="p-4 border-b border-gray-700/50">Calories</th>
                                <th className="p-4 border-b border-gray-700/50">Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {results.data
                                .filter((res) => res.result)
                                .sort((a, b) =>
                                    scoreType === "Time"
                                        ? a.result.localeCompare(b.result)
                                        : Number(b.result) - Number(a.result)
                                )
                                .map((result, index) => (
                                    <motion.tr
                                        key={result.id}
                                        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                                        className="bg-gray-900/50 hover:bg-gray-800/50 transition-all duration-300"
                                    >
                                        <td className="p-4 border-b border-gray-700/50">{index + 1}</td>
                                        <td className="p-4 border-b border-gray-700/50">{result.member.username}</td>
                                        <td className="p-4 border-b border-gray-700/50 font-bold text-blue-400">
                                            {result.result}
                                        </td>
                                        <td className="p-4 border-b border-gray-700/50">
                                            {result.duration
                                                ? `${Math.floor(result.duration / 60)}:${String(result.duration % 60).padStart(
                                                    2,
                                                    "0"
                                                )}`
                                                : "-"}
                                        </td>
                                        <td className="p-4 border-b border-gray-700/50">{result.avgHeartRate || "-"}</td>
                                        <td className="p-4 border-b border-gray-700/50">{result.caloriesBurned || "-"}</td>
                                        <td className="p-4 border-b border-gray-700/50">
                                            {new Date(result.createdDate).toLocaleDateString()}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-gray-400 text-center py-6"
                        >
                            No results available. Be the first to log one!
                        </motion.div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default Results;