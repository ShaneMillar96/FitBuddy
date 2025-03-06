import Logo from "@/assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "@/hooks/useLogout";
import { FaDumbbell, FaChartLine, FaSignOutAlt, FaVideo } from "react-icons/fa";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion"; // For animations

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
        <nav className="bg-gray-950/80 backdrop-blur-md text-white py-4 px-6 flex justify-between items-center border-b border-gray-800/50 sticky top-0 z-50">
            {/* Logo Section */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Link to="/" className="flex items-center space-x-3">
                    <img src={Logo} alt="FitBuddy Logo" className="h-10 w-10 rounded-full" />
                    <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        FitBuddy
                    </span>
                </Link>
            </motion.div>

            {/* Navigation Links */}
            {token && (
                <motion.div
                    className="flex items-center space-x-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {username && (
                        <motion.span
                            className="text-gray-300 text-lg font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Welcome, {username}
                        </motion.span>
                    )}
                    <Link
                        to="/workouts"
                        className="relative text-white hover:text-blue-400 transition-all duration-300 group"
                        title="Workouts"
                    >
                        <FaDumbbell className="text-2xl" />
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </Link>
                    <Link
                        to="/dashboard"
                        className="relative text-white hover:text-blue-400 transition-all duration-300 group"
                        title="Dashboard"
                    >
                        <FaChartLine className="text-2xl" />
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </Link>
                    <Link
                        to="/analysis"
                        className="relative text-white hover:text-blue-400 transition-all duration-300 group"
                        title="AI Coach Analysis"
                    >
                        <FaVideo className="text-2xl" />
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </Link>
                    <button
                        onClick={logout}
                        className="relative text-white hover:text-blue-400 transition-all duration-300 group"
                        title="Log Out"
                    >
                        <FaSignOutAlt className="text-2xl" />
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </button>
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;