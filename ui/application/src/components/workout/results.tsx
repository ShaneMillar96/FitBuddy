import { useWorkoutResults } from "@/hooks/useWorkoutResults";

interface ResultsProps {
    workoutId: string;
}

const Results = ({ workoutId }: ResultsProps) => {
    const { data: results, isLoading, error } = useWorkoutResults(workoutId);

    if (isLoading) return <p className="text-gray-400 text-center">Loading results...</p>;
    if (error) return <p className="text-red-500 text-center">Failed to load results.</p>;
    if (!results?.data.length) return <p className="text-gray-400 text-center">No results available.</p>;

    return (
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
                                {new Date(result.createdDate).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Results;
