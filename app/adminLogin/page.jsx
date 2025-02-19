"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/app/api/adminLogin"; // Import the API function

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        const response = await adminLogin(email, password);
        if (response.success) {
            localStorage.setItem("adminToken", response.adminToken); // Store token
            localStorage.setItem("shippingToken",response.shiprocketToken)
            router.push("/admin/home"); // Redirect to admin dashboard
        } else {
            setError(response.message);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 border rounded mt-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 border rounded mt-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;