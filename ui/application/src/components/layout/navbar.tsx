import Logo from "@/assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "@/hooks/useLogout";
import { FaDumbbell, FaChartLine, FaSignOutAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Changed to named import

interface JwtPayload {
    unique_name: string; // Maps to Username in your JWT
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
        <nav className="navbar bg-gray-950 text-white py-4 px-6 flex justify-between items-center border-b border-gray-800">
            <Link to="/" className="flex items-center space-x-3">
                <img src={Logo} alt="FitBuddy Logo" className="h-10 w-10" />
                <span className="text-white text-2xl font-bold">FitBuddy</span>
            </Link>

            {token && (
                <div className="flex items-center space-x-6">
                    {username && (
                        <span className="text-gray-300 text-lg">
                            Welcome, {username}
                        </span>
                    )}
                    <Link
                        to="/workouts"
                        className="text-white hover:text-gray-400 transition-all duration-200"
                        title="Workouts"
                    >
                        <FaDumbbell className="text-2xl" />
                    </Link>
                    <Link
                        to="/dashboard"
                        className="text-white hover:text-gray-400 transition-all duration-200"
                        title="Dashboard"
                    >
                        <FaChartLine className="text-2xl" />
                    </Link>
                    <button
                        onClick={logout}
                        className="text-white hover:text-gray-400 transition-all duration-200"
                        title="Log Out"
                    >
                        <FaSignOutAlt className="text-2xl" />
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;