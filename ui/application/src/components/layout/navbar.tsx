import Logo from "@/assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "@/hooks/useLogout";
import { FaDumbbell, FaChartLine, FaSignOutAlt, FaVideo, FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

interface JwtPayload {
    unique_name: string;
}

const Navbar = () => {
    const { logout } = useLogout();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode<JwtPayload>(token);
                setUsername(decodedToken.unique_name);
            } catch (error) {
                console.error("Failed to decode token:", error);
                setUsername(null);
            }
        }
    }, [token]);

    return (
        <nav className="bg-white text-gray-800 py-4 px-6 flex justify-between items-center border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            {/* Logo Section */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Link to="/" className="flex items-center space-x-3">
                    <img src={Logo} alt="FitBuddy Logo" className="h-10 w-10 rounded-full" />
                    <span className="text-2xl font-semibold text-gray-900">FitBuddy</span>
                </Link>
            </motion.div>

            {/* Navigation Links */}
            {token ? (
                <motion.div
                    className="flex items-center space-x-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Navigation Icons */}
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/workouts"
                            className="relative text-gray-600 hover:text-teal-400 transition-all duration-300 group"
                            title="Workouts"
                        >
                            <FaDumbbell className="text-xl" />
                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                        </Link>
                        <Link
                            to="/dashboard"
                            className="relative text-gray-600 hover:text-teal-400 transition-all duration-300 group"
                            title="Dashboard"
                        >
                            <FaChartLine className="text-xl" />
                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                        </Link>
                        <Link
                            to="/analysis"
                            className="relative text-gray-600 hover:text-teal-400 transition-all duration-300 group"
                            title="AI Coach Analysis"
                        >
                            <FaVideo className="text-xl" />
                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                        </Link>
                    </div>

                    {/* User Section with Dropdown Placeholder */}
                    {username && (
                        <motion.div
                            className="flex items-center space-x-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <FaUserCircle className="text-teal-400 text-xl" />
                            <span className="text-gray-600 text-sm font-medium">{username}</span>
                            <button
                                onClick={logout}
                                className="relative text-gray-600 hover:text-teal-400 transition-all duration-300 group"
                                title="Log Out"
                            >
                                <FaSignOutAlt className="text-xl" />
                                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            ) : (
                <motion.div
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Link
                        to="/login"
                        className="text-gray-600 hover:text-teal-400 transition-all duration-300 font-medium"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="px-4 py-2 bg-gradient-to-r from-teal-400 to-blue-400 text-white rounded-full hover:scale-105 transition-all duration-300 font-medium"
                    >
                        Sign Up
                    </Link>
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;