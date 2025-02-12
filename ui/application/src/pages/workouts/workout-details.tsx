import { useParams } from "react-router-dom";
import { useWorkoutDetails } from "@/hooks/useWorkoutDetails";
import { useWorkoutResults } from "@/hooks/useWorkoutResults";
import Tabs from "@/components/layout/Tabs"; 

const WorkoutDetails = () => {
    const { id } = useParams();
    const { data: workout, isLoading, error } = useWorkoutDetails(id!);
    const { data: results, isLoading: resultsLoading, error: resultsError } = useWorkoutResults(id!);

    if (isLoading) return <p className="text-gray-400 text-center">Loading workout details...</p>;
    if (error) return <p className="text-red-500 text-center">Failed to load workout details.</p>;
    if (!workout) return <p className="text-gray-500 text-center">Workout not found.</p>;

    const resultsContent = resultsLoading ? (
        <p className="text-gray-400 text-center">Loading results...</p>
    ) : resultsError ? (
        <p className="text-red-500 text-center">Failed to load results.</p>
    ) : results?.data.length > 0 ? (
        <div>
            <table className="w-full text-left border-collapse border border-gray-700">
                <thead className="bg-gray-800">
                <tr>
                    <th className="p-2 border border-gray-700">Rank</th>
                    <th className="p-2 border border-gray-700">User</th>
                    <th className="p-2 border border-gray-700">Score</th>
                    <th className="p-2 border border-gray-700">Date</th>
                </tr>
                </thead>
                <tbody>
                {results.data
                    .filter((res) => res.result) 
                    .sort((a, b) => a.result.localeCompare(b.result))
                    .map((result, index) => (
                        <tr key={result.id} className="bg-gray-900 hover:bg-gray-800">
                            <td className="p-2 border border-gray-700">{index + 1}</td>
                            <td className="p-2 border border-gray-700">{result.member.username}</td>
                            <td className="p-2 border border-gray-700 font-bold">{result.result}</td>
                            <td className="p-2 border border-gray-700">
                                {new Date(result.member.createdDate).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ) : (
        <p className="text-gray-400 text-center">No results available.</p>
    );

    const commentsContent = <p className="text-gray-400">Comments section coming soon...</p>;

    return (
        <div className="container mx-auto p-6 bg-black text-gray-300 border border-gray-700 rounded-lg shadow-lg">
            {/* Workout Name with Type in Brackets */}
            <h1 className="text-white text-4xl font-extrabold">
                {workout.name} <span className="text-gray-400 text-2xl">({workout.type.name})</span>
            </h1>

            {/* Large Workout Description with Line Breaks */}
            <pre className="text-gray-300 text-lg mt-4 whitespace-pre-wrap leading-relaxed border-t border-gray-700 pt-4">
                {workout.description}
            </pre>

            {/* Created By & Created Date in Small Text */}
            <p className="text-gray-400 text-sm mt-2">
                <strong>Created by:</strong> {workout.createdBy.username} | <strong>Created on:</strong> {new Date(workout.createdDate).toLocaleDateString()}
            </p>

            {/* Tabs Component */}
            <Tabs
                tabs={[
                    { label: "Results", content: resultsContent },
                    { label: "Comments", content: commentsContent },
                ]}
            />
        </div>
    );
};

export default WorkoutDetails;
