import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
    const { setAuth } = useAuth();

    const logout = async () => {
        // Clear auth state first
        setAuth({});

        try {
            // Call logout endpoint to clear httpOnly cookie on server
            await axios.post('/auth/logout', {}, {
                withCredentials: true
            });
        } catch (error) {
            console.error('Logout error:', error);
            // Continue with logout even if server request fails
        }

        // Clear any localStorage items related to session
        // Note: We keep 'persist' to remember user's "stay logged in" preference
        localStorage.removeItem('userId');

        // Optional: Force clear all query cache if using react-query
        // This prevents cached data from previous user being shown
        if (window.queryClient) {
            window.queryClient.clear();
        }
    };

    return logout;
};

export default useLogout;