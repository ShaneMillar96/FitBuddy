"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useLogin_1 = require("@/hooks/useLogin");
var react_router_dom_1 = require("react-router-dom");
var framer_motion_1 = require("framer-motion");
var Login = function () {
    var navigate = (0, react_router_dom_1.useNavigate)();
    var loginMutation = (0, useLogin_1.useLogin)();
    var _a = (0, react_1.useState)(""), username = _a[0], setUsername = _a[1];
    var _b = (0, react_1.useState)(""), password = _b[0], setPassword = _b[1];
    var handleLogin = function () {
        if (!username.trim() || !password.trim())
            return;
        loginMutation.mutate({ username: username, password: password }, {
            onSuccess: function () { return navigate("/workouts"); },
        });
    };
    return (<div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800 relative overflow-hidden">
            {/* Main Login Card */}
            <framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative bg-white p-8 rounded-3xl shadow-md border border-gray-100 max-w-md w-full text-center z-10">
                {/* Header */}
                <h2 className="text-3xl font-semibold text-gray-900 mb-8">Welcome Back</h2>

                {/* Form Inputs */}
                <div className="space-y-5">
                    <framer_motion_1.motion.input type="text" placeholder="Username" value={username} onChange={function (e) { return setUsername(e.target.value); }} className="w-full px-5 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 placeholder-gray-400 text-gray-800" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}/>
                    <framer_motion_1.motion.input type="password" placeholder="Password" value={password} onChange={function (e) { return setPassword(e.target.value); }} className="w-full px-5 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 placeholder-gray-400 text-gray-800" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}/>
                </div>

                {/* Login Button */}
                <framer_motion_1.motion.button onClick={handleLogin} disabled={loginMutation.isLoading} className="w-full px-5 py-3 mt-8 rounded-xl bg-gradient-to-r from-teal-400 to-blue-400 text-white font-medium hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-md" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    {loginMutation.isLoading ? (<span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>) : ("Login")}
                </framer_motion_1.motion.button>

                {/* Register Link */}
                <framer_motion_1.motion.p className="text-gray-500 mt-6 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    Don't have an account?{" "}
                    <span className="text-teal-400 hover:text-teal-500 cursor-pointer transition-colors duration-300" onClick={function () { return navigate("/register"); }}>
            Register here
          </span>
                </framer_motion_1.motion.p>

                {/* Error Message (if any) */}
                {loginMutation.isError && (<framer_motion_1.motion.p className="text-red-500 mt-4 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        Failed to login. Please check your credentials.
                    </framer_motion_1.motion.p>)}
            </framer_motion_1.motion.div>
        </div>);
};
exports.default = Login;
