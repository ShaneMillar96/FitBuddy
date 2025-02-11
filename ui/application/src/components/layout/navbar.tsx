import Logo from "@/assets/logo.png";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/">
                    <img src={Logo} alt="FitBuddy" className="h-14 w-auto" /> 
                </Link>

                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
