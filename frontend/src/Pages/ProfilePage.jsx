import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Clock, User, Mail, LogOut } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Handle logout with animation
  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      navigate('/'); // Redirect to home page after logout
    }, 800);
  };

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  if (!user) {
    // Loading state with spinner animation
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading user profile or not logged in...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 flex justify-center bg-gray-50">
      {/* Fixed navbar */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="font-bold text-xl text-blue-600">My Dashboard</div>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500 flex items-center">
              <Clock size={16} className="mr-1" />
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg h-fit">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Your Profile</h2>

        <div className="space-y-4 mb-8">
          <div className="transform transition duration-300 hover:translate-y-1 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-1">
              <User size={16} className="text-gray-500 mr-2" />
              <p className="text-sm font-medium text-gray-500">Name</p>
            </div>
            <p className="text-lg text-gray-900">{user.name || 'N/A'}</p>
          </div>
          
          <div className="transform transition duration-300 hover:translate-y-1 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-1">
              <Mail size={16} className="text-gray-500 mr-2" />
              <p className="text-sm font-medium text-gray-500">Email</p>
            </div>
            <p className="text-lg text-gray-900">{user.email || 'N/A'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`w-full py-2 px-4 rounded-md text-white font-medium 
          ${isLoggingOut ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'} 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 
          transition duration-200 flex items-center justify-center`}
        >
          {isLoggingOut ? (
            <>
              <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
              Logging out...
            </>
          ) : (
            <>
              <LogOut size={18} className="mr-2" />
              Logout
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;