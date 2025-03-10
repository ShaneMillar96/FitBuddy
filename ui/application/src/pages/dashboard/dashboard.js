"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var useDashboard_1 = require("@/hooks/useDashboard");
var WeeklyWorkoutChart_1 = require("@/components/workout/WeeklyWorkoutChart");
var fa_1 = require("react-icons/fa");
var framer_motion_1 = require("framer-motion");
// Skeleton loader for stats cards
var SkeletonStatCard = function () { return (<div className="bg-gray-100 animate-pulse rounded-2xl p-6 shadow-sm">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
    </div>); };
var Dashboard = function () {
    var _a = (0, useDashboard_1.useDashboard)(), data = _a.data, isLoading = _a.isLoading, error = _a.error;
    // Loading State with Skeleton Cards
    if (isLoading) {
        return (<div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6 lg:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {__spreadArray([], Array(3), true).map(function (_, idx) { return (<SkeletonStatCard key={idx}/>); })}
                </div>
            </div>);
    }
    // Error State
    if (error) {
        return (<framer_motion_1.motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-red-500 font-medium text-lg">
                Oops! Something went wrong. Please try again later.
            </framer_motion_1.motion.div>);
    }
    return (<div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800 p-6 lg:p-8">
            {/* Header Section */}
            <framer_motion_1.motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="mb-10">
                <h1 className="text-4xl font-semibold text-gray-900">Welcome Back!</h1>
                <p className="text-gray-500 mt-2">Keep up the great work! Here’s your fitness overview.</p>
            </framer_motion_1.motion.div>

            {/* Streak Indicator */}
            <framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-gradient-to-r from-teal-400 to-blue-400 text-white rounded-2xl p-6 mb-8 shadow-md flex items-center justify-between">
                <div className="flex items-center">
                    <fa_1.FaFire className="text-3xl mr-4"/>
                    <div>
                        <p className="text-lg font-semibold">Current Streak</p>
                        <p className="text-2xl font-bold">{(data === null || data === void 0 ? void 0 : data.streak) || 0} Days</p>
                    </div>
                </div>
                <p className="text-sm italic opacity-80">"Keep the fire burning!"</p>
            </framer_motion_1.motion.div>

            {/* Stats Grid */}
            <framer_motion_1.motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" initial="hidden" animate="visible" variants={{
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 },
            },
        }}>
                {/* Workouts Today */}
                <framer_motion_1.motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex items-center">
                    <fa_1.FaDumbbell className="text-teal-400 text-3xl mr-4"/>
                    <div>
                        <p className="text-gray-500 text-sm">Workouts Today</p>
                        <p className="text-gray-800 text-2xl font-semibold">{data.workoutsToday}</p>
                    </div>
                </framer_motion_1.motion.div>

                {/* Workouts This Week */}
                <framer_motion_1.motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex items-center">
                    <fa_1.FaDumbbell className="text-teal-400 text-3xl mr-4"/>
                    <div>
                        <p className="text-gray-500 text-sm">Workouts This Week</p>
                        <p className="text-gray-800 text-2xl font-semibold">{data.workoutsThisWeek}</p>
                    </div>
                </framer_motion_1.motion.div>

                {/* Workouts All Time */}
                <framer_motion_1.motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex items-center">
                    <fa_1.FaDumbbell className="text-teal-400 text-3xl mr-4"/>
                    <div>
                        <p className="text-gray-500 text-sm">Workouts All Time</p>
                        <p className="text-gray-800 text-2xl font-semibold">{data.workoutsAllTime}</p>
                    </div>
                </framer_motion_1.motion.div>

                {/* Total Comments */}
                <framer_motion_1.motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex items-center">
                    <fa_1.FaDumbbell className="text-teal-400 text-3xl mr-4"/>
                    <div>
                        <p className="text-gray-500 text-sm">Total Comments</p>
                        <p className="text-gray-800 text-2xl font-semibold">{data.totalComments}</p>
                    </div>
                </framer_motion_1.motion.div>

                {/* Favorite Workout Type */}
                <framer_motion_1.motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex items-center">
                    <fa_1.FaDumbbell className="text-teal-400 text-3xl mr-4"/>
                    <div>
                        <p className="text-gray-500 text-sm">Favorite Workout Type</p>
                        <p className="text-gray-800 text-2xl font-semibold">{data.favoriteWorkoutType || "None"}</p>
                    </div>
                </framer_motion_1.motion.div>

                {/* Best Workout Result */}
                {data.bestWorkoutResult && (<framer_motion_1.motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex items-center">
                        <fa_1.FaMedal className="text-yellow-400 text-3xl mr-4"/>
                        <div>
                            <p className="text-gray-500 text-sm">Best Result</p>
                            <p className="text-gray-800 text-lg font-semibold">
                                #{data.bestWorkoutResult.rank} in {data.bestWorkoutResult.workoutName} ({data.bestWorkoutResult.result})
                            </p>
                        </div>
                    </framer_motion_1.motion.div>)}
            </framer_motion_1.motion.div>

            {/* Weekly Activity Chart */}
            <framer_motion_1.motion.div className="mt-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Weekly Activity</h2>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <WeeklyWorkoutChart_1.default weeklyCounts={data.weeklyWorkoutCounts}/>
                </div>
            </framer_motion_1.motion.div>
        </div>);
};
exports.default = Dashboard;
