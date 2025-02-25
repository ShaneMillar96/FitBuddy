import { useState, useEffect } from "react";
import { useWorkoutResults } from "@/hooks/useWorkoutResults";
import { useAddWorkoutResult } from "@/hooks/useAddWorkoutResult";
import { useGarminActivities } from "@/hooks/useGarminSync";
import { FaSync } from "react-icons/fa";
import axiosInstance from "@shared/integration/instance";

interface ResultsProps {
    workoutId: string;
    scoreType: string;
}

interface GarminActivity {
    activityId: string;
    name: string;
    duration: number;
    avgHeartRate: number;
    caloriesBurned: number;
    startTime: string;
}

const Results = ({ workoutId, scoreType }: ResultsProps) => {
    const { data: results, isLoading, error } = useWorkoutResults(workoutId);
    const addResultMutation = useAddWorkoutResult();
    const [isAddingResult, setIsAddingResult] = useState(false);
    const [resultText, setResultText] = useState("");
    const [garminAccessToken, setGarminAccessToken] = useState<string | null>(null);
    const { data: garminActivities, refetch } = useGarminActivities(garminAccessToken || "");

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
                },
            }
        );
    };

    const handleGarminSync = () => {
        window.location.href = "http://localhost:5000/account/garmin-auth";
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        if (code) {
            axiosInstance.get(`/account/garmin-callback?code=${code}`).then((res) => {
                setGarminAccessToken(res.data.accessToken);
                refetch();
            });
        }
    }, []);

    if (isLoading) return <p className="text-gray-400 text-center">Loading results...</p>;
    if (error) return <p className="text-red-500 text-center">Failed to load results.</p>;

    return (
        <div>
            {isAddingResult ? (
                <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
                    <h2 className="text-white text-2xl font-bold mb-4">Add Your Result</h2>

                    <button
                        onClick={handleGarminSync}
                        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                    >
                        <FaSync className="mr-2" /> Sync with Garmin
                    </button>

                    {garminActivities && (
                        <select
                            onChange={(e) => {
                                const activity = garminActivities.find((a) => a.activityId === e.target.value);
                                if (activity) handleSubmitResult(activity);
                            }}
                            className="w-full px-4 py-2 mb-4 bg-gray-800 text-white border border-gray-600 rounded-lg"
                        >
                            <option value="">Select a Garmin Activity</option>
                            {garminActivities.map((a) => (
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
                                className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                        ) : (
                            <div className="flex items-center space-x-2">
                                <input
                                    type="number"
                                    value={resultText}
                                    onChange={(e) => setResultText(e.target.value)}
                                    placeholder="Total Reps"
                                    className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex space-x-4">
                        <button
                            onClick={() => handleSubmitResult()}
                            disabled={addResultMutation.isLoading}
                            className={`px-4 py-2 rounded-lg transition ${
                                addResultMutation.isLoading
                                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-300 text-black hover:bg-white"
                            }`}
                        >
                            {addResultMutation.isLoading ? "Submitting..." : "Submit"}
                        </button>
                        <button
                            onClick={() => setIsAddingResult(false)}
                            className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-white text-2xl font-bold">Leaderboard</h2>
                        <button
                            onClick={() => setIsAddingResult(true)}
                            className="px-4 py-2 rounded-lg bg-gray-300 text-black hover:bg-white"
                        >
                            + Add Result
                        </button>
                    </div>
                    {results?.data.length > 0 ? (
                        <table className="w-full text-left border-collapse border border-gray-700">
                            <thead className="bg-gray-800">
                            <tr>
                                <th className="p-2 border border-gray-700">Rank</th>
                                <th className="p-2 border border-gray-700">User</th>
                                <th className="p-2 border border-gray-700">{scoreType}</th>
                                <th className="p-2 border border-gray-700">Duration</th>
                                <th className="p-2 border border-gray-700">Avg HR</th>
                                <th className="p-2 border border-gray-700">Calories</th>
                                <th className="p-2 border border-gray-700">Date</th>
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
                                    <tr key={result.id} className="bg-gray-900 hover:bg-gray-800">
                                        <td className="p-2 border border-gray-700">{index + 1}</td>
                                        <td className="p-2 border border-gray-700">{result.member.username}</td>
                                        <td className="p-2 border border-gray-700 font-bold">{result.result}</td>
                                        <td className="p-2 border border-gray-700">
                                            {result.duration
                                                ? `${Math.floor(result.duration / 60)}:${String(result.duration % 60).padStart(2, "0")}`
                                                : "-"}
                                        </td>
                                        <td className="p-2 border border-gray-700">{result.avgHeartRate || "-"}</td>
                                        <td className="p-2 border border-gray-700">{result.caloriesBurned || "-"}</td>
                                        <td className="p-2 border border-gray-700">
                                            {new Date(result.createdDate).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-400 text-center">No results available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Results;