import { useState } from "react";
import { useLogin } from "@/hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
    const navigate = useNavigate();
    const loginMutation = useLogin();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        if (!username.trim() || !password.trim()) return;

        loginMutation.mutate(
            { username, password },
            {
                onSuccess: () => navigate("/workouts"),
            }
        );
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800 relative overflow-hidden">
            {/* Main Login Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative bg-white p-8 rounded-3xl shadow-md border border-gray-100 max-w-md w-full text-center z-10"
            >
                {/* Header */}
                <h2 className="text-3xl font-semibold text-gray-900 mb-8">Welcome Back</h2>

                {/* Form Inputs */}
                <div className="space-y-5">
                    <motion.input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-5 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 placeholder-gray-400 text-gray-800"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    />
                    <motion.input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-5 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 placeholder-gray-400 text-gray-800"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    />
                </div>

                {/* Login Button */}
                <motion.button
                    onClick={handleLogin}
                    disabled={loginMutation.isLoading}
                    className="w-full px-5 py-3 mt-8 rounded-xl bg-gradient-to-r from-teal-400 to-blue-400 text-white font-medium hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {loginMutation.isLoading ? (
                        <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                    ) : (
                        "Login"
                    )}
                </motion.button>

                {/* Register Link */}
                <motion.p
                    className="text-gray-500 mt-6 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Don't have an account?{" "}
                    <span
                        className="text-teal-400 hover:text-teal-500 cursor-pointer transition-colors duration-300"
                        onClick={() => navigate("/register")}
                    >
            Register here
          </span>
                </motion.p>

                {/* Error Message (if any) */}
                {loginMutation.isError && (
                    <motion.p
                        className="text-red-500 mt-4 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        Failed to login. Please check your credentials.
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
};

export default Login;