import { useState, useEffect } from "react";
import { authCheck, getUser } from "../services/api/authServices";

// Simulate authentication check (Replace with actual authentication logic)
export const useAuth =  () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null); // State to hold user data


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await authCheck(); // Calls the API to check session authentication
        console.log("Auth check response:", data);
        setIsAuthenticated(true);
        setIsVerified(data.email_verified);
       

        if (isVerified) {
          const userResponse = await getUser();
          setUserData(userResponse.data);
        }

      } catch (error) {
        setIsAuthenticated(false);
        setIsVerified(false);
      
        setUserData(null); // Reset user data if authentication fails

      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [isVerified]);

  return { isAuthenticated,isVerified, loading, userData }; // Return user data along with authentication status
};