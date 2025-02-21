import { useState } from "react";
import { useRegister } from "@/hooks/useRegister";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const registerMutation = useRegister();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = () => {
        if (!username.trim() || !email.trim() || !password.trim()) {
            return;
        }

        registerMutation.mutate(
            { username, email, password },
            {
                onSuccess: () => navigate("/login"),
            }
        );
    };

    return (
        <div className="flex items-center justify-center min-h-screen text-gray-300">
            <div className="bg-black p-8 rounded-lg shadow-lg border border-gray-700">
                <h2 className="text-white text-3xl font-bold mb-4 text-center">Register</h2>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 mb-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    onClick={handleRegister}
                    disabled={registerMutation.isLoading}
                    className="w-full px-4 py-2 rounded-lg bg-gray-500 text-black hover:bg-white"
                >
                    {registerMutation.isLoading ? "Registering..." : "Register"}
                </button>

                <p className="text-center text-gray-400 mt-4">
                    Already have an account?{" "}
                    <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/login")}>
                        Login here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;
