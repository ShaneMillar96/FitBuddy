"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var useWorkoutDetails_1 = require("@/hooks/useWorkoutDetails");
var Tabs_1 = require("@/components/layout/Tabs");
var Results_1 = require("@/components/workout/Results");
var Comments_1 = require("@/components/workout/Comments");
var framer_motion_1 = require("framer-motion");
// Skeleton loader for the header section
var SkeletonHeader = function () { return (<div className="bg-gray-100 animate-pulse rounded-2xl p-6 shadow-sm">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>); };
var WorkoutDetails = function () {
    var id = (0, react_router_dom_1.useParams)().id;
    var _a = (0, useWorkoutDetails_1.useWorkoutDetails)(id), workout = _a.data, isLoading = _a.isLoading, error = _a.error;
    var _b = (0, react_1.useState)("Results"), activeTab = _b[0], setActiveTab = _b[1];
    // Loading State
    if (isLoading) {
        return (<div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6 lg:p-8">
                <SkeletonHeader />
            </div>);
    }
    // Error State
    if (error) {
        return (<framer_motion_1.motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-red-500 font-medium text-lg">
                Failed to load workout details. Please try again later.
            </framer_motion_1.motion.div>);
    }
    return (<div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800 p-6 lg:p-8">
            {/* Header Section */}
            <framer_motion_1.motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="mb-8">
                <h1 className="text-4xl font-semibold text-gray-900">{workout.name}</h1>
                <div className="mt-4 space-y-2">
                    <p className="text-gray-500 text-base">
                        <span className="text-gray-600 font-medium">Type:</span> {workout.workoutType.name}
                    </p>
                    <p className="text-gray-500 text-base">
                        <span className="text-gray-600 font-medium">Created by:</span> {workout.createdBy.username}
                    </p>
                    <p className="text-gray-500 text-base">
                        <span className="text-gray-600 font-medium">Created on:</span>{" "}
                        {new Date(workout.createdDate).toLocaleDateString()}
                    </p>
                </div>
            </framer_motion_1.motion.div>

            {/* Description Section */}
            <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 text-gray-600 whitespace-pre-line">
                {workout.description || "No description available."}
            </framer_motion_1.motion.div>

            {/* Tabs Section */}
            <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <Tabs_1.default tabs={[
            { label: "Results", content: <Results_1.default workoutId={id} scoreType={workout.scoreType.name}/> },
            { label: "Comments", content: <Comments_1.default workoutId={id}/> },
        ]} activeTab={activeTab} setActiveTab={setActiveTab}/>
            </framer_motion_1.motion.div>
        </div>);
};
exports.default = WorkoutDetails;
