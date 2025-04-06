import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Keep jwt-decode for login

export const AuthContext = createContext();

const BASE_URL = "https://book-seats-alpha.vercel.app/api/users";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem("user"); 
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${BASE_URL}/login`, { email, password });

      // Add a check to ensure token exists before decoding
      if (res.data && res.data.token) {
        const decoded = jwtDecode(res.data.token);
        setUser({ ...decoded, token: res.data.token });

      } else {

        throw new Error("Login successful, but no token received.");
      }
    } catch (error) {
      
      const message = error.response?.data?.message || error.message || "Login failed. Please try again.";
      console.error("Login Error:", error.response?.data || error);
      throw new Error(message);
    }
  };

  // *** CORRECTED REGISTER for Scenario 1 ***
  // Assumes backend /register only returns success message, not a token.
  // User will need to log in separately after registering.
  const register = async (formData) => {
    try {
      // Just make the request. Don't expect a token back.
      await axios.post(`${BASE_URL}/register`, formData);
      // If the request succeeds (doesn't throw an error), registration was successful.
      // We don't set the user state here.
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Registration failed. Please try again.";
      console.error("Registration Error:", error.response?.data || error);
      throw new Error(message);
    }
  };

  const logout = () => {
    setUser(null);
  };

  // Check for token expiration periodically (Optional but recommended)
  useEffect(() => {
    const checkTokenExpiration = () => {
      if (user && user.exp) { // Assumes token has 'exp' field (standard JWT)
        const currentTime = Date.now() / 1000; // Convert ms to seconds
        if (user.exp < currentTime) {
          console.log("Token expired, logging out.");
          logout();
        }
      }
    };

    checkTokenExpiration(); // Check immediately on load/user change
    const intervalId = setInterval(checkTokenExpiration, 60 * 1000); // Check every minute

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [user]); 

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};