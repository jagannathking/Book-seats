import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Assuming React Router
import { TrainFront, Armchair, Ticket, LogIn } from 'lucide-react'; // Example icons

const HomePage = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Placeholder function for button click - replace with actual navigation
  const handleViewSeatsClick = () => {
    console.log("Navigating to booking page...");
    // Assuming your booking page route is '/coach'
    navigate('/coach');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-white"> {/* Optional gradient background */}

      {/* Hero Section */}
      <section className="flex-grow flex items-center justify-center text-center px-4 pt-20 pb-16 md:pt-28 md:pb-24 bg-blue-600 text-white shadow-md">
        <div className="max-w-3xl">
          <TrainFront size={64} className="mx-auto mb-6 text-blue-200" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            Effortless Train Seat Booking
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl mx-auto">
            Quickly view available seats and reserve your spot on our comfortable train coach.
          </p>
          <button
            onClick={handleViewSeatsClick}
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-md shadow-lg hover:bg-blue-50 transition duration-200 ease-in-out transform hover:-translate-y-0.5"
          >
            View Seats & Book Now
          </button>
        </div>
      </section>

      {/* How It Works / Features Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">
            Simple Booking Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Armchair size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">1. View Layout</h3>
              <p className="text-gray-600">
                See the clear 80-seat layout with available and booked seats marked instantly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Ticket size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">2. Select Seats</h3>
              <p className="text-gray-600">
                Choose up to 7 seats. We prioritize keeping your group together in one row.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <LogIn size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">3. Login & Book</h3>
              <p className="text-gray-600">
                Log in or sign up quickly, confirm your selection, and your seats are reserved!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Optional Call to Action (if not logged in, etc.) */}
      {/* You can conditionally render this based on auth state later */}
      {/*
      <section className="py-12 bg-gray-50 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ready to travel?</h2>
        <p className="text-gray-600 mb-6">Log in or create an account to manage your bookings.</p>
        <div>
          <Link to="/login" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mx-2 transition">Login</Link>
          <Link to="/signup" className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mx-2 transition">Sign Up</Link>
        </div>
      </section>
      */}

      {/* Footer (Simple) */}
      <footer className="text-center py-6 bg-white border-t border-gray-200">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} SimpleTrain Booking. All rights reserved.
        </p>
      </footer>

    </div>
  )
}

export default HomePage;