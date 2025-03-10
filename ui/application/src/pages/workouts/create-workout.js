"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useWorkoutTypes_1 = require("@/hooks/useWorkoutTypes");
var useCreateWorkout_1 = require("@/hooks/useCreateWorkout");
var react_router_dom_1 = require("react-router-dom");
var react_toastify_1 = require("react-toastify");
var framer_motion_1 = require("framer-motion");
// Skeleton for loading state
var SkeletonSelect = function () { return (<div className="bg-gray-100 animate-pulse rounded-xl p-3 w-full h-12"></div>); };
var CreateWorkout = function () {
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _a = (0, useWorkoutTypes_1.useWorkoutTypes)(), workoutTypes = _a.data, typesLoading = _a.isLoading, typesError = _a.error;
    var createWorkoutMutation = (0, useCreateWorkout_1.useCreateWorkout)();
    var _b = (0, react_1.useState)(""), name = _b[0], setName = _b[1];
    var _c = (0, react_1.useState)(""), description = _c[0], setDescription = _c[1];
    var _d = (0, react_1.useState)(null), typeId = _d[0], setTypeId = _d[1];
    var handleSubmit = function () {
        if (!name.trim() || name.length < 3 || name.length > 25) {
            react_toastify_1.toast.error("Name should be between 3 and 25 characters long.");
            return;
        }
        if (!description.trim() || description.length < 10) {
            react_toastify_1.toast.error("Description should be at least 10 characters long.");
            return;
        }
        if (!typeId) {
            react_toastify_1.toast.error("Please select a workout type.");
            return;
        }
        createWorkoutMutation.mutate({ name: name, description: description, typeId: typeId }, {
            onSuccess: function () {
                react_toastify_1.toast.success("Workout created successfully!");
                setTimeout(function () { return navigate("/"); }, 2000);
            },
            onError: function () {
                react_toastify_1.toast.error("Failed to create workout. Please try again.");
            },
        });
    };
    return (<div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800 p-6 lg:p-8">
            {/* Header Section */}
            <framer_motion_1.motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="mb-8">
                <h1 className="text-4xl font-semibold text-gray-900">Create Workout</h1>
                <p className="text-gray-500 mt-2">Design a new workout to share with the community.</p>
            </framer_motion_1.motion.div>

            {/* Form Container */}
            <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
                {/* Workout Name */}
                <div className="mb-6">
                    <label className="block text-gray-600 text-sm font-medium mb-2">Workout Name</label>
                    <input type="text" value={name} onChange={function (e) { return setName(e.target.value); }} placeholder="Enter workout name (3-25 chars)" className="w-full px-5 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 placeholder-gray-400 text-gray-800"/>
                </div>

                {/* Workout Type */}
                <div className="mb-6">
                    <label className="block text-gray-600 text-sm font-medium mb-2">Workout Type</label>
                    {typesLoading ? (<SkeletonSelect />) : typesError ? (<framer_motion_1.motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-center py-2">
                            Failed to load workout types.
                        </framer_motion_1.motion.p>) : (<select value={typeId || ""} onChange={function (e) { return setTypeId(Number(e.target.value)); }} className="w-full px-5 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 text-gray-800">
                            <option value="" disabled>Select a workout type</option>
                            {workoutTypes === null || workoutTypes === void 0 ? void 0 : workoutTypes.map(function (type) { return (<option key={type.id} value={type.id} className="bg-white">
                                    {type.name}
                                </option>); })}
                        </select>)}
                </div>

                {/* Description */}
                <div className="mb-6">
                    <label className="block text-gray-600 text-sm font-medium mb-2">Description</label>
                    <textarea value={description} onChange={function (e) { return setDescription(e.target.value); }} placeholder="Enter description (min 10 chars)" rows={4} className="w-full px-5 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 placeholder-gray-400 text-gray-800 resize-none"/>
                </div>

                {/* Submit Button */}
                <framer_motion_1.motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} onClick={handleSubmit} disabled={createWorkoutMutation.isLoading} className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-blue-400 text-white font-medium hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-md">
                    {createWorkoutMutation.isLoading ? (<span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>) : ("Create Workout")}
                </framer_motion_1.motion.button>
            </framer_motion_1.motion.div>
        </div>);
};
exports.default = CreateWorkout;
