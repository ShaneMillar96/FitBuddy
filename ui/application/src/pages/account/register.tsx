import { useState } from "react";
import { useRegister } from "@/hooks/useRegister";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // For animations

const Register = () => {
    const navigate = useNavigate();
    const registerMutation = useRegister();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = () => {
        if (!username.trim() || !email.trim() || !password.trim()) return;

        registerMutation.mutate(
            { username, email, password },
            {
                onSuccess: () => navigate("/login"),
            }
        );
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white relative overflow-hidden">
            {/* Background Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />

            {/* Main Register Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative bg-gray-900/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-700/50 max-w-md w-full text-center z-10"
            >
                {/* Header */}
                <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-8">
                    Create an Account
                </h2>

                {/* Form Inputs */}
                <div className="space-y-5">
                    <motion.input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-5 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 placeholder-gray-400"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    />
                    <motion.input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-5 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 placeholder-gray-400"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    />
                    <motion.input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-5 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 placeholder-gray-400"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    />
                </div>

                {/* Register Button */}
                <motion.button
                    onClick={handleRegister}
                    disabled={registerMutation.isLoading}
                    className="w-full px-5 py-3 mt-8 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
                >
                    {registerMutation.isLoading ? (
                        <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                    ) : (
                        "Register"
                    )}
                </motion.button>

                {/* Login Link */}
                <motion.p
                    className="text-gray-400 mt-6 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Already have an account?{" "}
                    <span
                        className="text-blue-400 hover:text-blue-300 cursor-pointer transition-colors duration-300"
                        onClick={() => navigate("/login")}
                    >
                        Login here
                    </span>
                </motion.p>

                {/* Error Message (if any) */}
                {registerMutation.isError && (
                    <motion.p
                        className="text-red-400 mt-4 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        Failed to register. Please try again.
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
};

export default Register;