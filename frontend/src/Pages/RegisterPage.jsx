import { useState, useEffect } from "react";
import React from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [validations, setValidations] = useState({
    name: { valid: true, message: "" },
    email: { valid: true, message: "" },
    password: { valid: true, message: "" },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  // Validate form fields in real-time
  useEffect(() => {
    // Only validate fields that have been touched
    const validateName = () => {
      if (!formData.name) return { valid: true, message: "" };
      if (formData.name.length < 3) {
        return { valid: false, message: "Name must be at least 3 characters" };
      }
      return { valid: true, message: "" };
    };

    const validateEmail = () => {
      if (!formData.email) return { valid: true, message: "" };
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        return { valid: false, message: "Please enter a valid email" };
      }
      return { valid: true, message: "" };
    };

    const validatePassword = () => {
      if (!formData.password) return { valid: true, message: "" };
      if (formData.password.length < 6) {
        return { valid: false, message: "Password must be at least 6 characters" };
      }
      return { valid: true, message: "" };
    };

    const newValidations = {
      name: validateName(),
      email: validateEmail(),
      password: validatePassword(),
    };

    setValidations(newValidations);

    // Check if entire form is valid for submission
    const isValid = 
      formData.name.length > 0 && 
      formData.email.length > 0 && 
      formData.password.length > 0 && 
      newValidations.name.valid && 
      newValidations.email.valid && 
      newValidations.password.valid;
    
    setFormValid(isValid);
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear general error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) return;
    
    setIsSubmitting(true);
    try {
      await register({ ...formData });
      navigate("/save-recipe");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get color for border based on validation and whether field has been touched
  const getBorderColor = (field) => {
    if (formData[field] === "") return "border-gray-300";
    return validations[field].valid ? "border-green-500" : "border-red-500";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
     
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create your account</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getBorderColor("name")}`}
              required
            />
            {!validations.name.valid && (
              <p className="mt-1 text-sm text-red-600">{validations.name.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getBorderColor("password")}`}
              required
              autoComplete="new-password"
            />
            {!validations.password.valid && (
              <p className="mt-1 text-sm text-red-600">{validations.password.message}</p>
            )}
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
                Processing...
              </span>
            ) : "Create Account"}
          </button>
          
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;