"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useExerciseAnalysis_1 = require("@/hooks/useExerciseAnalysis");
var useExerciseTypes_1 = require("@/hooks/useExerciseTypes");
var fa_1 = require("react-icons/fa");
var react_toastify_1 = require("react-toastify");
var framer_motion_1 = require("framer-motion");
// Skeleton for loading state
var SkeletonSelect = function () { return (<div className="bg-gray-100 animate-pulse rounded-xl p-3 w-full h-12"></div>); };
var Analysis = function () {
    var _a, _b;
    var _c = (0, react_1.useState)(null), file = _c[0], setFile = _c[1];
    var _d = (0, react_1.useState)(null), exerciseTypeId = _d[0], setExerciseTypeId = _d[1];
    var _e = (0, react_1.useState)(null), videoId = _e[0], setVideoId = _e[1];
    var _f = (0, react_1.useState)(false), isProcessing = _f[0], setIsProcessing = _f[1];
    var fileInputRef = (0, react_1.useRef)(null);
    var _g = (0, useExerciseAnalysis_1.useExerciseAnalysis)(), uploadVideo = _g.uploadVideo, getAnalysis = _g.getAnalysis;
    var analysisQuery = getAnalysis(videoId || undefined);
    var _h = (0, useExerciseTypes_1.useExerciseTypes)(), exerciseTypes = _h.data, isLoading = _h.isLoading, isError = _h.isError, error = _h.error;
    var handleFileChange = function (e) {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setVideoId(null);
            setIsProcessing(false);
        }
    };
    var handleUpload = function () {
        if (!file || !exerciseTypeId) {
            react_toastify_1.toast.error("Please select a video and exercise type.");
            return;
        }
        setIsProcessing(true);
        uploadVideo.mutate({ file: file, exerciseTypeId: exerciseTypeId }, {
            onSuccess: function (id) {
                setVideoId(id);
                setFile(null);
                setExerciseTypeId(null);
                if (fileInputRef.current)
                    fileInputRef.current.value = "";
                setIsProcessing(false);
            },
            onError: function (error) {
                react_toastify_1.toast.error("Upload failed: ".concat(error.message));
                setIsProcessing(false);
            },
        });
    };
    (0, react_1.useEffect)(function () {
        if (videoId && !analysisQuery.isFetching && !analysisQuery.data) {
            analysisQuery.refetch();
        }
        if (videoId && analysisQuery.data) {
            setIsProcessing(false);
        }
    }, [videoId, analysisQuery]);
    var apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    return (<div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800 p-6 lg:p-8">
            {/* Header Section */}
            <framer_motion_1.motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="mb-8">
                <h1 className="text-4xl font-semibold text-gray-900">AI Coach Analysis</h1>
                <p className="text-gray-500 mt-2">Upload a video to get personalized feedback on your exercise form.</p>
            </framer_motion_1.motion.div>

            {/* Exercise Type Selection */}
            <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8">
                <label className="block text-gray-600 text-sm font-medium mb-2">Select Exercise Type</label>
                {isLoading ? (<SkeletonSelect />) : isError ? (<framer_motion_1.motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-center py-4">
                        Error: {error.message}
                    </framer_motion_1.motion.p>) : (<select value={exerciseTypeId || ""} onChange={function (e) { return setExerciseTypeId(parseInt(e.target.value, 10)); }} className="w-full px-5 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 text-gray-800">
                        <option value="" disabled>Select Exercise Type</option>
                        {exerciseTypes === null || exerciseTypes === void 0 ? void 0 : exerciseTypes.map(function (type) { return (<option key={type.id} value={type.id} className="bg-white">
                                {type.name}
                            </option>); })}
                    </select>)}
            </framer_motion_1.motion.div>

            {/* Video Upload */}
            <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mb-8">
                <label className="block text-gray-600 text-sm font-medium mb-2">Upload Video</label>
                <input type="file" accept="video/*" onChange={handleFileChange} ref={fileInputRef} className="w-full px-5 py-3 bg-white rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 file:bg-teal-400 file:text-white file:border-none file:rounded-xl file:px-4 file:py-2 file:cursor-pointer hover:file:bg-teal-500"/>
            </framer_motion_1.motion.div>

            {/* Analyze Button */}
            <framer_motion_1.motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} onClick={handleUpload} disabled={isProcessing || !file || !exerciseTypeId} className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-blue-400 text-white font-medium hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-md flex items-center justify-center mb-8">
                <fa_1.FaUpload className="mr-2"/> {isProcessing ? "Processing..." : "Analyze Video"}
            </framer_motion_1.motion.button>

            {/* Processing Feedback */}
            {isProcessing && (<framer_motion_1.motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600 flex items-center justify-center mb-4">
                    <span className="animate-spin mr-2 inline-block w-5 h-5 border-2 border-t-teal-400 border-gray-300 rounded-full"></span>
                    Analyzing...
                </framer_motion_1.motion.p>)}

            {/* Error Messages */}
            {(uploadVideo.error || analysisQuery.error) && (<framer_motion_1.motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-center mb-4">
                    Error: {((_a = uploadVideo.error) === null || _a === void 0 ? void 0 : _a.message) || ((_b = analysisQuery.error) === null || _b === void 0 ? void 0 : _b.message)}
                </framer_motion_1.motion.p>)}

            {/* Analysis Result */}
            {analysisQuery.data && !isProcessing && (<framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Result</h2>
                    <p className="text-gray-600 mb-4">
                        {analysisQuery.data.analysisResult
                ? JSON.parse(analysisQuery.data.analysisResult).feedback.join(", ")
                : "No feedback available."}
                    </p>
                    <video src={"".concat(apiBaseUrl).concat(analysisQuery.data.filePath)} controls className="w-full max-w-2xl rounded-xl border border-gray-200" onError={function (e) { return console.error("Video load error:", e); }}/>
                </framer_motion_1.motion.div>)}
        </div>);
};
exports.default = Analysis;
