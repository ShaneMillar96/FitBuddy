import Logo from "@/assets/logo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar bg-gray-950 text-white py-4 px-6 flex justify-between items-center border-b border-gray-800">
            <Link to="/" className="flex items-center space-x-3">
                <img src={Logo} alt="FitBuddy Logo" className="h-10 w-10" />
                <span className="text-white text-2xl font-bold">FitBuddy</span>
            </Link>
            <div className="flex space-x-6">
                <Link to="/create-workout" className="text-white hover:text-gray-400">
                    New Workout
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
