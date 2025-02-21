import { useState } from "react";
import { useWorkoutResults } from "@/hooks/useWorkoutResults";
import { useAddWorkoutResult } from "@/hooks/useAddWorkoutResult";

interface ResultsProps {
    workoutId: string;
    scoreType: string;
}

const Results = ({ workoutId, scoreType }: ResultsProps) => {
    const { data: results, isLoading, error } = useWorkoutResults(workoutId);
    const addResultMutation = useAddWorkoutResult();

    const [isAddingResult, setIsAddingResult] = useState(false);
    const [resultText, setResultText] = useState("");

    const handleSubmitResult = () => {
        if (!resultText.trim()) return;

        addResultMutation.mutate(
            { workoutId: Number(workoutId), result: resultText },
            {
                onSuccess: () => {
                    setResultText("");
                    setIsAddingResult(false);
                },
            }
        );
    };

    if (isLoading) return <p className="text-gray-400 text-center">Loading results...</p>;
    if (error) return <p className="text-red-500 text-center">Failed to load results.</p>;

    return (
        <div>
            {isAddingResult ? (
                <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
                    <h2 className="text-white text-2xl font-bold mb-4">Add Your Result</h2>

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
                            onClick={handleSubmitResult}
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
                                <th className="p-2 border border-gray-700">Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {results.data
                                .filter((res) => res.result)
                                .sort((a, b) => scoreType === "Time"
                                    ? a.result.localeCompare(b.result) 
                                    : Number(b.result) - Number(a.result) 
                                )
                                .map((result, index) => (
                                    <tr key={result.id} className="bg-gray-900 hover:bg-gray-800">
                                        <td className="p-2 border border-gray-700">{index + 1}</td>
                                        <td className="p-2 border border-gray-700">{result.member.username}</td>
                                        <td className="p-2 border border-gray-700 font-bold">{result.result}</td>
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
