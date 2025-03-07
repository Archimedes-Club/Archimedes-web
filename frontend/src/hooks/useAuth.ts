import { useState, useEffect } from "react";

// Simulate authentication check (Replace with actual authentication logic)
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Simulate checking authentication from localStorage or API
    const userToken = localStorage.getItem("authToken");
    setIsAuthenticated(!!userToken);
  }, []);

  return { isAuthenticated };
};