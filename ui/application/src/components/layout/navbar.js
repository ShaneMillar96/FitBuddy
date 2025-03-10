"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logo_png_1 = require("@/assets/logo.png");
var react_router_dom_1 = require("react-router-dom");
var useLogout_1 = require("@/hooks/useLogout");
var fa_1 = require("react-icons/fa");
var react_1 = require("react");
var jwt_decode_1 = require("jwt-decode");
var framer_motion_1 = require("framer-motion");
var Navbar = function () {
    var logout = (0, useLogout_1.useLogout)().logout;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var token = localStorage.getItem("token");
    var _a = (0, react_1.useState)(null), username = _a[0], setUsername = _a[1];
    (0, react_1.useEffect)(function () {
        if (token) {
            try {
                var decodedToken = (0, jwt_decode_1.jwtDecode)(token);
                setUsername(decodedToken.unique_name);
            }
            catch (error) {
                console.error("Failed to decode token:", error);
                setUsername(null);
            }
        }
    }, [token]);
    return (<nav className="bg-white text-gray-800 py-4 px-6 flex justify-between items-center border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            {/* Logo Section */}
            <framer_motion_1.motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <react_router_dom_1.Link to="/" className="flex items-center space-x-3">
                    <img src={logo_png_1.default} alt="FitBuddy Logo" className="h-10 w-10 rounded-full"/>
                    <span className="text-2xl font-semibold text-gray-900">FitBuddy</span>
                </react_router_dom_1.Link>
            </framer_motion_1.motion.div>

            {/* Navigation Links */}
            {token ? (<framer_motion_1.motion.div className="flex items-center space-x-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    {/* Navigation Icons */}
                    <div className="flex items-center space-x-4">
                        <react_router_dom_1.Link to="/workouts" className="relative text-gray-600 hover:text-teal-400 transition-all duration-300 group" title="Workouts">
                            <fa_1.FaDumbbell className="text-xl"/>
                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"/>
                        </react_router_dom_1.Link>
                        <react_router_dom_1.Link to="/dashboard" className="relative text-gray-600 hover:text-teal-400 transition-all duration-300 group" title="Dashboard">
                            <fa_1.FaChartLine className="text-xl"/>
                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"/>
                        </react_router_dom_1.Link>
                        <react_router_dom_1.Link to="/analysis" className="relative text-gray-600 hover:text-teal-400 transition-all duration-300 group" title="AI Coach Analysis">
                            <fa_1.FaVideo className="text-xl"/>
                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"/>
                        </react_router_dom_1.Link>
                    </div>

                    {/* User Section with Dropdown Placeholder */}
                    {username && (<framer_motion_1.motion.div className="flex items-center space-x-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                            <fa_1.FaUserCircle className="text-teal-400 text-xl"/>
                            <span className="text-gray-600 text-sm font-medium">{username}</span>
                            <button onClick={logout} className="relative text-gray-600 hover:text-teal-400 transition-all duration-300 group" title="Log Out">
                                <fa_1.FaSignOutAlt className="text-xl"/>
                                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"/>
                            </button>
                        </framer_motion_1.motion.div>)}
                </framer_motion_1.motion.div>) : (<framer_motion_1.motion.div className="flex items-center space-x-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <react_router_dom_1.Link to="/login" className="text-gray-600 hover:text-teal-400 transition-all duration-300 font-medium">
                        Login
                    </react_router_dom_1.Link>
                    <react_router_dom_1.Link to="/signup" className="px-4 py-2 bg-gradient-to-r from-teal-400 to-blue-400 text-white rounded-full hover:scale-105 transition-all duration-300 font-medium">
                        Sign Up
                    </react_router_dom_1.Link>
                </framer_motion_1.motion.div>)}
        </nav>);
};
exports.default = Navbar;
