import { useState } from "react";
import { useLogin } from "@/hooks/useLogin";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const loginMutation = useLogin();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        if (!username.trim() || !password.trim()) {
            return;
        }

        loginMutation.mutate(
            { username, password },
            {
                onSuccess: () => navigate("/workouts"),
            }
        );
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-gray-300">
            <div className="bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-700">
                <h2 className="text-white text-3xl font-bold mb-4 text-center">Login</h2>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 mb-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 mb-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none"
                />

                <button
                    onClick={handleLogin}
                    disabled={loginMutation.isLoading}
                    className="w-full px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                    {loginMutation.isLoading ? "Logging in..." : "Login"}
                </button>

                <p className="text-center text-gray-400 mt-4">
                    Don't have an account?{" "}
                    <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/register")}>
                        Register here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
