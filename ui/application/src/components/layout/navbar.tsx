import Logo from "@/assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "@/hooks/useLogout";

const Navbar = () => {
    const { logout } = useLogout();
    const navigate = useNavigate();
    const token = localStorage.getItem("token"); 
    
    return (
        <nav
            className="navbar bg-gray-950 text-white py-4 px-6 flex justify-between items-center border-b border-gray-800">
            <Link to="/" className="flex items-center space-x-3">
                <img src={Logo} alt="FitBuddy Logo" className="h-10 w-10"/>
                <span className="text-white text-2xl font-bold">FitBuddy</span>
            </Link>
            {token && (
                <div className="flex items-center space-x-4">
                    <Link to="/dashboard" className="text-white hover:text-gray-400">Dashboard</Link>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        Log Out
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
