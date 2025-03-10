import Logo from "@/assets/logo.png";
import { Link, useLocation } from "react-router-dom";
import { useLogout } from "@/hooks/useLogout";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

interface JwtPayload {
    unique_name: string;
}

const Navbar = () => {
    const { logout } = useLogout();
    const location = useLocation();
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

    const links = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Workouts", path: "/workouts" },
        { name: "AI Coach Analysis", path: "/analysis" }
    ];

    return (
        <nav className="bg-white text-gray-800 py-4 px-6 border-b border-gray-100 sticky top-0 z-50 shadow-sm flex justify-between items-center">
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-3">
                <img src={Logo} alt="FitBuddy Logo" className="h-10 w-10 rounded-full" />
                <span className="text-2xl font-semibold text-gray-900">FitBuddy</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex justify-center items-center space-x-10">
                {links.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`relative text-gray-600 hover:text-teal-400 transition-all duration-300 group font-medium text-lg ${
                            location.pathname === link.path ? "text-teal-500" : ""
                        }`}
                    >
                        {link.name}
                        <span
                            className={`absolute left-0 bottom-0 w-full h-0.5 bg-teal-400 transition-transform duration-300 ${
                                location.pathname === link.path ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                            }`}
                        />
                    </Link>
                ))}
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-4">
                {token ? (
                    <>
                        {username && (
                            <div className="flex items-center space-x-2">
                                <img
                                    src="https://via.placeholder.com/40"
                                    alt="User Placeholder"
                                    className="h-10 w-10 rounded-full border border-gray-300"
                                />
                                <span className="text-gray-600 text-sm font-medium">{username}</span>
                            </div>
                        )}
                        <button
                            onClick={logout}
                            className="text-gray-600 hover:text-teal-400 transition-all duration-300 font-medium"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
