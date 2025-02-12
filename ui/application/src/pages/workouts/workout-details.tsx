import { useParams } from "react-router-dom";
import { useState } from "react";
import { useWorkoutDetails } from "@/hooks/useWorkoutDetails";
import { useWorkoutResults } from "@/hooks/useWorkoutResults";
import { useWorkoutComments } from "@/hooks/useWorkoutComments";
import Tabs from "@/components/layout/Tabs";

const WorkoutDetails = () => {
    const { id } = useParams();
    const { data: workout, isLoading, error } = useWorkoutDetails(id!);
    const { data: results, isLoading: resultsLoading, error: resultsError } = useWorkoutResults(id!);

    const [commentPage, setCommentPage] = useState(1);
    const { data: comments, isLoading: commentsLoading, error: commentsError } = useWorkoutComments(id!, commentPage, 10);
    const isNextDisabled = comments?.data.length < 10 || (commentPage * 10) >= (comments?.totalCount || 0);

    if (isLoading) return <p className="text-gray-400 text-center">Loading workout details...</p>;
    if (error) return <p className="text-red-500 text-center">Failed to load workout details.</p>;
    if (!workout) return <p className="text-gray-500 text-center">Workout not found.</p>;

    const resultsContent = resultsLoading ? (
        <p className="text-gray-400 text-center">Loading results...</p>
    ) : resultsError ? (
        <p className="text-red-500 text-center">Failed to load results.</p>
    ) : results?.data.length > 0 ? (
        <div>
            <h2 className="text-white text-2xl font-bold mb-4">Leaderboard</h2>
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
    ) : (
        <p className="text-gray-400 text-center">No results available.</p>
    );

    // ✅ Comments Tab Content (With Pagination)
    const commentsContent = commentsLoading ? (
        <p className="text-gray-400 text-center">Loading comments...</p>
    ) : commentsError ? (
        <p className="text-red-500 text-center">Failed to load comments.</p>
    ) : comments?.data.length > 0 ? (
        <div>
            {/* Comments List */}
            <div className="space-y-4">
                {comments.data.map((comment) => (
                    <div key={comment.id} className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
                        <p className="text-gray-300">{comment.description}</p>
                        <p className="text-sm text-gray-500 mt-2">— {comment.member.username}, {new Date(comment.createdDate).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <button
                    disabled={commentPage === 1}
                    onClick={() => setCommentPage((prev) => Math.max(prev - 1, 1))}
                    className={`px-4 py-2 rounded-md ${
                        commentPage === 1 ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-gray-300 text-black hover:bg-white"
                    }`}
                >
                    Previous
                </button>
                <span className="text-gray-400">Page {commentPage}</span>
                <button
                    disabled={isNextDisabled}
                    onClick={() => setCommentPage((prev) => prev + 1)}
                    className={`px-4 py-2 rounded-md ${
                        isNextDisabled ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-gray-300 text-black hover:bg-white"
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    ) : (
        <p className="text-gray-400 text-center">No comments yet.</p>
    );

    return (
        <div className="container mx-auto p-6 bg-black text-gray-300 border border-gray-700 rounded-lg shadow-lg">
            <h1 className="text-white text-4xl font-extrabold">
                {workout.name} <span className="text-gray-400 text-2xl">({workout.type.name})</span>
            </h1>

            <pre className="text-gray-300 text-lg mt-4 whitespace-pre-wrap leading-relaxed border-t border-gray-700 pt-4">
                {workout.description}
            </pre>

            <p className="text-gray-400 text-sm mt-2">
                <strong>Created by:</strong> {workout.createdBy.username} | <strong>Created on:</strong> {new Date(workout.createdDate).toLocaleDateString()}
            </p>

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
