import { useState, useEffect } from "react";
import React from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ 
    email: "", 
    password: "" 
  });
  
  const [validations, setValidations] = useState({
    email: { valid: true, message: "" },
    password: { valid: true, message: "" },
  });
  
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Validate form fields in real-time
  useEffect(() => {
    const validateEmail = () => {
      if (!credentials.email) return { valid: true, message: "" };
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentials.email)) {
        return { valid: false, message: "Please enter a valid email address" };
      }
      return { valid: true, message: "" };
    };

    const validatePassword = () => {
      if (!credentials.password) return { valid: true, message: "" };
      return { valid: true, message: "" };
    };

    const newValidations = {
      email: validateEmail(),
      password: validatePassword(),
    };

    setValidations(newValidations);

    // Check if form is valid for submission
    const isValid = 
      credentials.email.length > 0 && 
      credentials.password.length > 0 && 
      newValidations.email.valid;
    
    setFormValid(isValid);
  }, [credentials]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError(""); // Clear general error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) return;
    
    setIsSubmitting(true);
    try {
      await login(credentials.email, credentials.password);
      navigate("/save-recipe");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get color for border based on validation
  const getBorderColor = (field) => {
    if (credentials[field] === "") return "border-gray-300";
    return validations[field].valid ? "border-green-500" : "border-red-500";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
     
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome back</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={credentials.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getBorderColor("email")}`}
              required
              autoComplete="email"
            />
            {!validations.email.valid && (
              <p className="mt-1 text-sm text-red-600">{validations.email.message}</p>
            )}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              
            </div>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getBorderColor("password")}`}
              required
              autoComplete="current-password"
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          
          <button
            type="submit"
            disabled={!formValid || isSubmitting}
            className={`w-full py-2 px-4 rounded-md text-white font-medium transition duration-200 
              ${formValid && !isSubmitting 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-blue-300 cursor-not-allowed"}`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : "Sign in"}
          </button>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;