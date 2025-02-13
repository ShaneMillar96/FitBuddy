import { useState } from "react";
import { useWorkoutComments } from "@/hooks/useWorkoutComments";
import { usePostComment } from "@/hooks/usePostComment";

interface CommentsProps {
    workoutId: string;
}

const Comments = ({ workoutId }: CommentsProps) => {
    const [commentPage, setCommentPage] = useState(1);
    const [commentText, setCommentText] = useState("");

    const { data: comments, isLoading, error } = useWorkoutComments(workoutId, commentPage, 10);
    const postCommentMutation = usePostComment();

    const isNextDisabled = comments?.data.length < 10 || (commentPage * 10) >= (comments?.totalCount || 0);

    const handlePostComment = () => {
        if (!commentText.trim()) return;
        postCommentMutation.mutate(
            { workoutId, comment: commentText },
            { onSuccess: () => setCommentText("") }
        );
    };

    return (
        <div>
            {isLoading ? (
                <p className="text-gray-400 text-center">Loading comments...</p>
            ) : error ? (
                <p className="text-red-500 text-center">Failed to load comments.</p>
            ) : comments?.data.length > 0 ? (
                <div className="space-y-4">
                    {comments.data.map((comment) => (
                        <div key={comment.id} className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
                            <p className="text-gray-300">{comment.description}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                — {comment.member.username}, {new Date(comment.createdDate).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 text-center">No comments yet.</p>
            )}

            <div className="mt-6 flex items-center gap-4">
                <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <button
                    onClick={handlePostComment}
                    disabled={postCommentMutation.isLoading}
                    className={`px-4 py-2 rounded-lg transition ${
                        postCommentMutation.isLoading
                            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                            : "bg-blue-400 text-white hover:bg-gray-800"
                    }`}
                >
                    {postCommentMutation.isLoading ? "Posting..." : "Post"}
                </button>
            </div>

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
    );
};

export default Comments;
