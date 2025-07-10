import { useState, useEffect } from "react";
import { useWorkoutResults } from "@/hooks/useWorkoutResults";
import { useAddWorkoutResult } from "@/hooks/useAddWorkoutResult";
import { useGarminSync, GarminActivity } from "@/hooks/useGarminSync";
import { FaSync, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";

// Skeleton for loading state
const SkeletonRow = () => (
    <tr className="bg-gray-100 animate-pulse">
        {[...Array(7)].map((_, index) => (
            <td key={index} className="p-4 border-b border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
            </td>
        ))}
    </tr>
);

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
                ...(garminData && {
                    duration: garminData.duration,
                    avgHeartRate: garminData.avgHeartRate,
                    caloriesBurned: garminData.caloriesBurned,
                    garminActivityId: garminData.activityId,
                }),
            },
            {
                onSuccess: () => {
                    setResultText("");
                    setIsAddingResult(false);
                    refetch();
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

    useEffect(() => {
        refetch();
    }, [workoutId, refetch]);

    if (isLoading) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                <table className="w-full text-left border-collapse border border-gray-200 rounded-xl overflow-hidden">
                    <thead className="bg-gray-100 text-gray-600">
                    <tr>
                        <th className="p-4 border-b border-gray-200">Rank</th>
                        <th className="p-4 border-b border-gray-200">User</th>
                        <th className="p-4 border-b border-gray-200">{scoreType}</th>
                        <th className="p-4 border-b border-gray-200">Duration</th>
                        <th className="p-4 border-b border-gray-200">Avg HR</th>
                        <th className="p-4 border-b border-gray-200">Calories</th>
                        <th className="p-4 border-b border-gray-200">Date</th>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-center py-6">
                Failed to load results. Please try again.
            </motion.div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Leaderboard</h2>
                <button
                    onClick={() => setIsAddingResult(true)}
                    className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-teal-400 to-blue-400 rounded-xl text-white font-medium hover:scale-105 transition-all duration-300 shadow-md"
                >
                    <FaPlus /> Add Result
                </button>
            </div>

            {isAddingResult ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Your Result</h2>

                    {fetchGarminActivities.data && (
                        <select
                            onChange={(e) => {
                                const activity = fetchGarminActivities.data.find((a) => a.activityId === e.target.value);
                                if (activity) handleSubmitResult(activity);
                            }}
                            className="w-full px-5 py-3 mb-4 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 text-gray-800"
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
                                className="w-full px-5 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 placeholder-gray-400 text-gray-800"
                            />
                        ) : (
                            <div className="flex items-center space-x-2 w-full">
                                <input
                                    type="number"
                                    value={resultText}
                                    onChange={(e) => setResultText(e.target.value)}
                                    placeholder="Total Reps"
                                    min="0"
                                    className="w-full px-5 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 placeholder-gray-400 text-gray-800"
                                />
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex space-x-4">
                        <button
                            onClick={() => handleSubmitResult()}
                            disabled={addResultMutation.isPending || !resultText.trim()}
                            className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-blue-400 text-white font-medium hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-md"
                        >
                            {addResultMutation.isPending ? (
                                <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                            ) : (
                                "Submit"
                            )}
                        </button>
                        <button
                            onClick={() => setIsAddingResult(false)}
                            className="px-5 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-all duration-300"
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
                        visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
                    }}
                >
                    {results?.data.length > 0 ? (
                        <table className="w-full text-left border-collapse border border-gray-200 rounded-xl overflow-hidden">
                            <thead className="bg-gray-100 text-gray-600">
                            <tr>
                                <th className="p-4 border-b border-gray-200">Rank</th>
                                <th className="p-4 border-b border-gray-200">User</th>
                                <th className="p-4 border-b border-gray-200">{scoreType}</th>
                                <th className="p-4 border-b border-gray-200">Duration</th>
                                <th className="p-4 border-b border-gray-200">Avg HR</th>
                                <th className="p-4 border-b border-gray-200">Calories</th>
                                <th className="p-4 border-b border-gray-200">Date</th>
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
                                        className="bg-white hover:bg-gray-50 transition-all duration-300"
                                    >
                                        <td className="p-4 border-b border-gray-200">{index + 1}</td>
                                        <td className="p-4 border-b border-gray-200">{result.member.username}</td>
                                        <td className="p-4 border-b border-gray-200 font-medium text-teal-400">
                                            {result.result}
                                        </td>
                                        <td className="p-4 border-b border-gray-200">
                                            {result.duration
                                                ? `${Math.floor(result.duration / 60)}:${String(result.duration % 60).padStart(2, "0")}`
                                                : "-"}
                                        </td>
                                        <td className="p-4 border-b border-gray-200">{result.avgHeartRate || "-"}</td>
                                        <td className="p-4 border-b border-gray-200">{result.caloriesBurned || "-"}</td>
                                        <td className="p-4 border-b border-gray-200">
                                            {new Date(result.createdDate).toLocaleDateString()}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500 text-center py-6">
                            No results available. Be the first to log one!
                        </motion.div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default Results;