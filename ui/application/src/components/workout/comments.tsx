import { useState, useEffect } from "react";
import { useWorkoutComments } from "@/hooks/useWorkoutComments";
import { usePostComment } from "@/hooks/usePostComment";
import { motion } from "framer-motion";

// Skeleton for loading state
const SkeletonComment = () => (
    <div className="bg-gray-100 animate-pulse rounded-2xl p-5 shadow-sm">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
);

interface CommentsProps {
    workoutId: string;
}

const Comments = ({ workoutId }: CommentsProps) => {
    const [commentPage, setCommentPage] = useState(1);
    const [commentText, setCommentText] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const { data: comments, isLoading, error, refetch } = useWorkoutComments(workoutId, commentPage, 10);
    const postCommentMutation = usePostComment();

    useEffect(() => {
        refetch();
    }, [workoutId, refetch, commentPage]);

    const isNextDisabled = comments?.data?.length < 10 || (commentPage * 10) >= (comments?.totalCount || 0);

    const handlePostComment = () => {
        if (!commentText.trim()) return;
        setIsPosting(true);
        postCommentMutation.mutate(
            { workoutId, comment: commentText, page: commentPage },
            {
                onSuccess: () => {
                    setCommentText("");
                    setIsPosting(false);
                    refetch();
                },
                onError: () => {
                    setIsPosting(false);
                },
            }
        );
    };

    return (
        <div className="min-h-[calc(100vh-200px)] p-6">
            {/* Header */}
            <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-semibold text-gray-900 mb-6"
            >
                Comments
            </motion.h2>

            {/* Comments List */}
            {isLoading || isPosting ? (
                <motion.div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                        <SkeletonComment key={index} />
                    ))}
                </motion.div>
            ) : error ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-center py-6">
                    Failed to load comments. Please try again.
                </motion.div>
            ) : comments?.data?.length > 0 ? (
                <motion.div
                    className="space-y-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                    }}
                >
                    {comments.data.map((comment) => (
                        <motion.div
                            key={comment.id}
                            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md"
                        >
                            <p className="text-gray-600">{comment.description || "No comment text"}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                — {comment.member?.username || "Unknown User"}, {new Date(comment.createdDate).toLocaleDateString()}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500 text-center py-6">
                    No comments yet. Be the first to share your thoughts!
                </motion.div>
            )}

            {/* Comment Input */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 flex items-center gap-4"
            >
                <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full px-5 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 placeholder-gray-400 text-gray-800"
                    disabled={isPosting}
                />
                <button
                    onClick={handlePostComment}
                    disabled={postCommentMutation.isLoading || isPosting}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-blue-400 text-white font-medium hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-md"
                >
                    {postCommentMutation.isLoading || isPosting ? (
                        <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                    ) : (
                        "Post"
                    )}
                </button>
            </motion.div>

            {/* Pagination */}
            {comments?.data?.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-between items-center mt-6"
                >
                    <button
                        disabled={commentPage === 1}
                        onClick={() => setCommentPage((prev) => Math.max(prev - 1, 1))}
                        className="px-5 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-gray-600">Page {commentPage}</span>
                    <button
                        disabled={isNextDisabled}
                        onClick={() => setCommentPage((prev) => prev + 1)}
                        className="px-5 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default Comments;