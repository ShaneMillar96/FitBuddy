import { useState, useEffect } from "react";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaFilter, FaSort, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

// Skeleton loader component for loading state
const SkeletonCard = () => (
    <div className="bg-gray-100 animate-pulse rounded-2xl p-6 h-56 shadow-sm">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
);

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup timeout if value or delay changes
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const WorkoutList = () => {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState(""); // Real-time input value
    const [sortBy, setSortBy] = useState("");
    const [sortDirection, setSortDirection] = useState("asc");
    const [filterType, setFilterType] = useState("");
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    // Debounce the search input (e.g., 500ms delay)
    const debouncedSearch = useDebounce(searchInput, 500);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useWorkouts({
        pageSize: 10,
        sortBy,
        sortDirection,
        search: debouncedSearch, // Use debounced search value
    });

    // Loading State with Skeleton Cards
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6 lg:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, idx) => (
                        <SkeletonCard key={idx} />
                    ))}
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 text-red-500 font-medium text-lg"
            >
                Oops! Something went wrong. Please try again later.
            </motion.div>
        );
    }

    const workouts = data?.pages.flatMap((page) => page.data) || [];

    // Extract unique workout types for filter dropdown
    const workoutTypes = [...new Set(workouts.map((workout) => workout.workoutType.name))];

    // Filter workouts client-side based on workout type
    const filteredWorkouts = filterType
        ? workouts.filter((workout) => workout.workoutType.name === filterType)
        : workouts;

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value); // Update real-time input
    };

    // Handle filter selection
    const handleFilterChange = (type: string) => {
        setFilterType(type);
        setShowFilterDropdown(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800 p-6 lg:p-8">
            {/* Header Section */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-semibold text-gray-900">Your Workouts</h1>
                    <div className="flex space-x-4">
                        {/* Filter Button and Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
                            >
                                <FaFilter className="text-gray-600" />
                            </button>
                            {showFilterDropdown && (
                                <div
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-md border border-gray-200 z-20"
                                >
                                    <div className="p-2">
                                        <button
                                            onClick={() => handleFilterChange("")}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                                        >
                                            All Types
                                        </button>
                                        {workoutTypes.map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => handleFilterChange(type)}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <input
                        type="text"
                        value={searchInput} // Bind to real-time input
                        onChange={handleSearchChange}
                        placeholder="Search workouts..."
                        className="w-full px-5 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 placeholder-gray-400 text-gray-800"
                    />
                    <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </motion.div>

            {/* Workout Grid Container with Constrained Height */}
            <div className="relative">
                {/* Empty State */}
                {filteredWorkouts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center py-20"
                    >
                        <p className="text-xl font-light text-gray-500 mb-6">
                            {debouncedSearch || filterType
                                ? "No workouts match your search or filter."
                                : "No workouts yet. Let’s get started!"}
                        </p>
                        <button
                            onClick={() => navigate("/create-workout")}
                            className="px-6 py-3 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full text-white font-medium hover:scale-105 transition-all duration-300 shadow-md"
                        >
                            Create a Workout
                        </button>
                    </motion.div>
                ) : (
                    <>
                        {/* Workout Grid */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.15 },
                                },
                            }}
                        >
                            {filteredWorkouts.map((workout) => (
                                <motion.div
                                    key={workout.id}
                                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                    onClick={() => navigate(`/workouts/${workout.id}`)}
                                    className="relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group border border-gray-100"
                                >
                                    {/* Card Content */}
                                    <div className="relative z-10">
                                        <h2 className="text-lg font-semibold text-gray-800 truncate">{workout.name}</h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            By: <span className="text-gray-600">{workout.createdBy.username}</span>
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Type: <span className="text-gray-600">{workout.workoutType.name}</span>
                                        </p>
                                        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                                            <span>🏋️‍♂️ {workout.resultsLogged} logged</span>
                                            <span>💬 {workout.commentsCount} comments</span>
                                        </div>
                                    </div>
                                    {/* Subtle Hover Overlay */}
                                    <div className="absolute inset-0 bg-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Load More Button */}
                        {hasNextPage && filteredWorkouts.length >= 10 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-10 text-center"
                            >
                                <button
                                    onClick={() => fetchNextPage()}
                                    className="px-6 py-3 bg-teal-400 text-white rounded-full font-medium hover:bg-teal-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isFetchingNextPage}
                                >
                                    {isFetchingNextPage ? (
                                        <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                                    ) : (
                                        "Load More Workouts"
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </>
                )}
            </div>

            {/* Floating Action Button for New Workout */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/create-workout")}
                className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
                <FaPlus className="text-xl" />
            </motion.button>
        </div>
    );
};

export default WorkoutList;