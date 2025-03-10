"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var react_1 = require("react");
var useWorkoutResults_1 = require("@/hooks/useWorkoutResults");
var useAddWorkoutResult_1 = require("@/hooks/useAddWorkoutResult");
var useGarminSync_1 = require("@/hooks/useGarminSync");
var fa_1 = require("react-icons/fa");
var framer_motion_1 = require("framer-motion");
// Skeleton for loading state
var SkeletonRow = function () { return (<tr className="bg-gray-100 animate-pulse">
        {__spreadArray([], Array(7), true).map(function (_, index) { return (<td key={index} className="p-4 border-b border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
            </td>); })}
    </tr>); };
var Results = function (_a) {
    var workoutId = _a.workoutId, scoreType = _a.scoreType;
    var _b = (0, useWorkoutResults_1.useWorkoutResults)(workoutId), results = _b.data, isLoading = _b.isLoading, error = _b.error, refetch = _b.refetch;
    var addResultMutation = (0, useAddWorkoutResult_1.useAddWorkoutResult)();
    var _c = (0, react_1.useState)(false), isAddingResult = _c[0], setIsAddingResult = _c[1];
    var _d = (0, react_1.useState)(""), resultText = _d[0], setResultText = _d[1];
    var _e = (0, useGarminSync_1.useGarminSync)(), initiateGarminAuth = _e.initiateGarminAuth, fetchGarminActivities = _e.fetchGarminActivities, handleGarminCallback = _e.handleGarminCallback;
    var handleSubmitResult = function (garminData) {
        if (!resultText.trim() && !garminData)
            return;
        addResultMutation.mutate(__assign({ workoutId: Number(workoutId), result: resultText || (garminData === null || garminData === void 0 ? void 0 : garminData.name) || "" }, (garminData && {
            duration: garminData.duration,
            avgHeartRate: garminData.avgHeartRate,
            caloriesBurned: garminData.caloriesBurned,
            garminActivityId: garminData.activityId,
        })), {
            onSuccess: function () {
                setResultText("");
                setIsAddingResult(false);
                refetch();
            },
        });
    };
    (0, react_1.useEffect)(function () {
        var urlParams = new URLSearchParams(window.location.search);
        var code = urlParams.get("code");
        if (code) {
            handleGarminCallback(code)
                .then(function () {
                fetchGarminActivities.refetch();
                window.history.replaceState({}, document.title, window.location.pathname);
            })
                .catch(function (err) { return console.error("Garmin callback error:", err); });
        }
    }, [handleGarminCallback, fetchGarminActivities]);
    (0, react_1.useEffect)(function () {
        refetch();
    }, [workoutId, refetch]);
    if (isLoading) {
        return (<framer_motion_1.motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                <table className="w-full text-left border-collapse border border-gray-200 rounded-xl overflow-hidden">
                    <thead className="bg-gray-100 text-gray-600">
                    <tr>
                        <th className="p-4 border-b border-gray-200">Rank</th>
                        <th className="p-4 border-b border-gray-200">User</th>
                        <th className="p-4 border-b border-gray-200">{scoreType}</th>
                        <th className="p-4 border-b border-gray-200">Duration</th>
                        <th className="p-4 border-b border-gray-200">Avg HR</th>
                        <th className="p-4 border-b border-gray-200">Calories</th>
                        <th className="p-4 border-b border-gray-200">Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {__spreadArray([], Array(3), true).map(function (_, index) { return (<SkeletonRow key={index}/>); })}
                    </tbody>
                </table>
            </framer_motion_1.motion.div>);
    }
    if (error) {
        return (<framer_motion_1.motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-center py-6">
                Failed to load results. Please try again.
            </framer_motion_1.motion.div>);
    }
    return (<div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Leaderboard</h2>
                <button onClick={function () { return setIsAddingResult(true); }} className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-teal-400 to-blue-400 rounded-xl text-white font-medium hover:scale-105 transition-all duration-300 shadow-md">
                    <fa_1.FaPlus /> Add Result
                </button>
            </div>

            {isAddingResult ? (<framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Your Result</h2>

                    {fetchGarminActivities.data && (<select onChange={function (e) {
                    var activity = fetchGarminActivities.data.find(function (a) { return a.activityId === e.target.value; });
                    if (activity)
                        handleSubmitResult(activity);
                }} className="w-full px-5 py-3 mb-4 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 text-gray-800">
                            <option value="">Select a Garmin Activity</option>
                            {fetchGarminActivities.data.map(function (a) { return (<option key={a.activityId} value={a.activityId}>
                                    {a.name} ({new Date(a.startTime).toLocaleDateString()})
                                </option>); })}
                        </select>)}

                    <div className="flex space-x-4 items-center">
                        {scoreType === "Time" ? (<input type="text" value={resultText} onChange={function (e) { return setResultText(e.target.value); }} placeholder="mm:ss" pattern="[0-5]?[0-9]:[0-5][0-9]" className="w-full px-5 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 placeholder-gray-400 text-gray-800"/>) : (<div className="flex items-center space-x-2 w-full">
                                <input type="number" value={resultText} onChange={function (e) { return setResultText(e.target.value); }} placeholder="Total Reps" min="0" className="w-full px-5 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 placeholder-gray-400 text-gray-800"/>
                            </div>)}
                    </div>

                    <div className="mt-4 flex space-x-4">
                        <button onClick={function () { return handleSubmitResult(); }} disabled={addResultMutation.isLoading || !resultText.trim()} className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-blue-400 text-white font-medium hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-md">
                            {addResultMutation.isLoading ? (<span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>) : ("Submit")}
                        </button>
                        <button onClick={function () { return setIsAddingResult(false); }} className="px-5 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-all duration-300">
                            Cancel
                        </button>
                    </div>
                </framer_motion_1.motion.div>) : (<framer_motion_1.motion.div initial="hidden" animate="visible" variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
            }}>
                    {(results === null || results === void 0 ? void 0 : results.data.length) > 0 ? (<table className="w-full text-left border-collapse border border-gray-200 rounded-xl overflow-hidden">
                            <thead className="bg-gray-100 text-gray-600">
                            <tr>
                                <th className="p-4 border-b border-gray-200">Rank</th>
                                <th className="p-4 border-b border-gray-200">User</th>
                                <th className="p-4 border-b border-gray-200">{scoreType}</th>
                                <th className="p-4 border-b border-gray-200">Duration</th>
                                <th className="p-4 border-b border-gray-200">Avg HR</th>
                                <th className="p-4 border-b border-gray-200">Calories</th>
                                <th className="p-4 border-b border-gray-200">Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {results.data
                    .filter(function (res) { return res.result; })
                    .sort(function (a, b) {
                    return scoreType === "Time"
                        ? a.result.localeCompare(b.result)
                        : Number(b.result) - Number(a.result);
                })
                    .map(function (result, index) { return (<framer_motion_1.motion.tr key={result.id} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="bg-white hover:bg-gray-50 transition-all duration-300">
                                        <td className="p-4 border-b border-gray-200">{index + 1}</td>
                                        <td className="p-4 border-b border-gray-200">{result.member.username}</td>
                                        <td className="p-4 border-b border-gray-200 font-medium text-teal-400">
                                            {result.result}
                                        </td>
                                        <td className="p-4 border-b border-gray-200">
                                            {result.duration
                        ? "".concat(Math.floor(result.duration / 60), ":").concat(String(result.duration % 60).padStart(2, "0"))
                        : "-"}
                                        </td>
                                        <td className="p-4 border-b border-gray-200">{result.avgHeartRate || "-"}</td>
                                        <td className="p-4 border-b border-gray-200">{result.caloriesBurned || "-"}</td>
                                        <td className="p-4 border-b border-gray-200">
                                            {new Date(result.createdDate).toLocaleDateString()}
                                        </td>
                                    </framer_motion_1.motion.tr>); })}
                            </tbody>
                        </table>) : (<framer_motion_1.motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500 text-center py-6">
                            No results available. Be the first to log one!
                        </framer_motion_1.motion.div>)}
                </framer_motion_1.motion.div>)}
        </div>);
};
exports.default = Results;
