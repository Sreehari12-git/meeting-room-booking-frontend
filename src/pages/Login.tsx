import { useState } from "react"
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const[error,setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {
        setError("");
        try {
            const data = await loginUser(email, password);
            if(data.user.role === "ADMIN") {
                navigate('/create-room')
            } else {
                navigate("/book-room");
            }

        } catch (error: any) {
            console.log(error);
            alert(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Welcome</h1>
                    <p className="mt-2 text-sm text-gray-400">Sign in to your account</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
                    <div className="space-y-5">

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-300">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {setEmail(e.target.value); setError("");}}
                                placeholder="Enter email"
                                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password "
                                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            />
                        </div>
                        {error && (<p className="text-sm text-red-400 text-center">{error}</p>)}

                        <button
                            onClick={handleLogin}
                            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors duration-150 cursor-pointer"
                        >
                            Sign in
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

