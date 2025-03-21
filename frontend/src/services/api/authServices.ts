import axios from 'axios';

const API_URL  = process.env.REACT_APP_API_URL;

// Creating the api setup with URL, Creds and headers
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers:{
        Accept: "application/json",
        "Content-Type": "application/json"
    }
})

// Function to handle API errors based on response status
export const handleApiError = (error) => {
    if (error.response) {
      const status = error.response.status;
  
      switch (status) {
        case 400:
          throw new Error("Bad request. Please check your input.");
        case 401:
          throw new Error("Unauthorized. Please login.");
        case 403:
          throw new Error("Forbidden. You don’t have permission to access this.");
        case 404:
          throw new Error("Resource not found.");
        case 422:
          throw new Error(
            error.response.data.message || "Validation error. Please check your input."
          );
        case 500:
          throw new Error("Server error. Please try again later.");
        default:
          throw new Error(error.response.data.message || "An error occurred.");
      }
    } else if (error.request) {
      throw new Error("No response from server. Please check your network.");
    } else {
      throw new Error("Unexpected error: " + error.message);
    }
  };


// Function to get a cookie value
const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) {
            return value;
        }
    }
    return "";
};

// Api call to get the CSRF cookies and set it to browser
export const getCsrfToken = async () =>{
    try{
        await api.get("sanctum/csrf-cookie");

        // Extract XSRF-TOKEN from cookies
        const csrfToken = getCookie("XSRF-TOKEN"); 
        if (csrfToken) {
            const decodedToken = decodeURIComponent(csrfToken); // Decode the token
            // Store decoded token in cookies manually (optional)
            document.cookie = `XSRF-TOKEN=${decodedToken}; path=/; Secure`;
        }
    }catch(error){
        handleApiError(error);
    }
}

export const login = async (email, password) => {
    try {
        await getCsrfToken();
        const response = await api.post("api/login", {email, password});
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
    
}

// Logout api call, which clears the cookies
export const logout = async () => {
    try {
        const response = await api.post('api/v1/logout' );
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

// Get the user detail of current logged in user
export const getUser = async() => {
    try {
        const response = await api.get("api/v1/user");
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}


export const registerUser = async(userData) => {
  try {
    const response = await api.post("api/register", userData);
    return response;
  } catch (error) {
    handleApiError(error);
  }
}