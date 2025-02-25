import axios from "axios";

const API_URL = "https://backend.gezeno.in/api/users/admin/login"; // Change to your backend URL

export const adminLogin = async (email, password) => {
    try {
        const response = await axios.post(API_URL, { email, password });
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Login failed" };
    }
};