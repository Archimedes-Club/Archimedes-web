import { useState, useEffect } from "react";
import { authCheck, getUser } from "../services/api/authServices";

// Simulate authentication check (Replace with actual authentication logic)
export const useAuth =  () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await authCheck(); // Calls the API to check session authentication
        setIsAuthenticated(true);
        setIsVerified(data.email_verified);
      } catch (error) {
        setIsAuthenticated(false);
        setIsVerified(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated,isVerified, loading };
};