import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

// Import Pages
import HomePage from "../Pages/HomePage";
import RegisterPage from "../Pages/RegisterPage";
import LoginPage from "../Pages/LoginPage";
import BookPage from "../Pages/BookPage";
import ProfilePage from "../Pages/ProfilePage";

// Import ProtectedRoute
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../Context/AuthContext";

const NavRoutes = () => {
  const { user } = useAuth(); 

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />

        {/* Routes hidden when logged in */}
        <Route
          path="/register"
          element={
            !user ? <RegisterPage /> : <Navigate to="/profile" replace />
          }
        />
        <Route
          path="/login"
          element={
            !user ? <LoginPage /> : <Navigate to="/profile" replace />
          }
        />

        {/* Protected Routes (Require Login) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book-seats"
          element={
            <ProtectedRoute>
              <BookPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default NavRoutes;
