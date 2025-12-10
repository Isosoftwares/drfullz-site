import { toast } from "react-toastify";
import axios from "../api/axios";
import useAuth from "./useAuth";
import useLogout from "./useLogout";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const logout = useLogout();

  const refresh = async () => {
    try {
      const response = await axios.get("/auth/refresh", {
        withCredentials: true, // This will send the httpOnly cookie
      });

      if (response?.data?.message === "Unauthorized") {
        toast.info("Your session expired");
        await logout();
        return null;
      }

      // Ensure we have valid user data before setting auth
      if (!response?.data?.data?.user || !response?.data?.data?.accessToken) {
        console.error("Invalid refresh response - missing user or token");
        await logout();
        return null;
      }

      // Set auth with fresh data from server
      setAuth({
        roles: [response.data.data.user.role],
        accessToken: response.data.data.accessToken,
        user: response.data.data.user,
        userId: response.data.data.user._id,
      });

      return response.data.data.accessToken;
    } catch (error) {
      // Handle refresh token expired or invalid
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        toast.info("Your session expired");
        await logout();
        return null;
      }

      console.error("Refresh token error:", error);
      // On any error, logout to be safe
      await logout();
      return null;
    }
  };
  
  return refresh;
};

export default useRefreshToken;