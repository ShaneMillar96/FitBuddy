import { useState, useEffect } from "react";
import { useWorkoutComments } from "@/hooks/useWorkoutComments";
import { usePostComment } from "@/hooks/usePostComment";
import { motion } from "framer-motion"; // For animations

interface CommentsProps {
    workoutId: string;
}

const Comments = ({ workoutId }: CommentsProps) => {
    const [commentPage, setCommentPage] = useState(1);
    const [commentText, setCommentText] = useState("");
    const [isPosting, setIsPosting] = useState(false); // Track posting state
    const { data: comments, isLoading, error, refetch } = useWorkoutComments(workoutId, commentPage, 10);
    const postCommentMutation = usePostComment();

    // Debugging: Log the comments data to verify
    useEffect(() => {
        console.log("Comments data:", comments);
    }, [comments]);

    // Refetch on mount to ensure immediate data load
    useEffect(() => {
        refetch();
    }, [workoutId, refetch, commentPage]);

    const isNextDisabled = comments?.data?.length < 10 || (commentPage * 10) >= (comments?.totalCount || 0);

    const handlePostComment = () => {
        if (!commentText.trim()) return;
        setIsPosting(true);
        postCommentMutation.mutate(
            { workoutId, comment: commentText, page: commentPage }, // Pass page for query key alignment
            {
                onSuccess: () => {
                    setCommentText("");
                    setIsPosting(false);
                    refetch(); // Force refetch to ensure update
                },
                onError: () => {
                    setIsPosting(false);
                },
            }
        );
    };

    // Skeleton for loading state
    const SkeletonComment = () => (
        <motion.div
            className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-xl p-5 shadow-lg animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </motion.div>
    );

    return (
        <div className="min-h-[calc(100vh-200px)] bg-gray-950 p-6 relative">
            {/* Header */}
            <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-6"
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
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-center py-6"
                >
                    Failed to load comments. {error.message || "Please try again."}
                </motion.div>
            ) : comments?.data?.length > 0 ? (
                <motion.div
                    className="space-y-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 },
                        },
                    }}
                >
                    {comments.data.map((comment) => (
                        <motion.div
                            key={comment.id}
                            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                            className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-xl p-5 shadow-lg transition-all duration-300 hover:border-blue-500/50"
                        >
                            <p className="text-gray-300 text-lg">{comment.description || "No comment text"}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                — {comment.member?.username || "Unknown User"},{" "}
                                {new Date(comment.createdDate).toLocaleDateString()}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-400 text-center py-6"
                >
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
                    className="w-full px-5 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 placeholder-gray-400"
                    disabled={isPosting}
                />
                <button
                    onClick={handlePostComment}
                    disabled={postCommentMutation.isLoading || isPosting}
                    className={`px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-lg ${
                        postCommentMutation.isLoading || isPosting ? "animate-pulse" : ""
                    }`}
                >
                    {(postCommentMutation.isLoading || isPosting) ? (
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
                        className={`px-5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        Previous
                    </button>
                    <span className="text-gray-400">Page {commentPage}</span>
                    <button
                        disabled={isNextDisabled}
                        onClick={() => setCommentPage((prev) => prev + 1)}
                        className={`px-5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        Next
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default Comments;