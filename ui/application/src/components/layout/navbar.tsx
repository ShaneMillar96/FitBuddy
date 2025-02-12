import Logo from "@/assets/logo.png";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar bg-blue-600 text-white p-4 shadow-md">
                <Link to="/">
                    <img src={Logo} alt="FitBuddy" className="max-h-16 w-auto"/>
                </Link>
                <div className="flex space-x-6">
                    <a href="/" className="text-white hover:text-gray-400">Home</a>
                    <a href="/workouts" className="text-white hover:text-gray-400">Workouts</a>
                    <a href="/profile" className="text-white hover:text-gray-400">Profile</a>
                </div>
        </nav>
    );
};

export default Navbar;
