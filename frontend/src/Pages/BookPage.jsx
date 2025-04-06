import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import { Loader2, Armchair, Circle, XCircle, CheckCircle, Trash2, Ticket, Info, AlertTriangle } from 'lucide-react';

// Use your actual deployed backend API base URL
const API_BASE_URL = "https://book-seats-alpha.vercel.app/api";
const TOTAL_SEATS = 80;
const SEATS_PER_ROW = 7; 

const BookPage = () => {
  // State for seat data and loading/error for the map itself
  const [seats, setSeats] = useState([]);
  const [isLoadingSeats, setIsLoadingSeats] = useState(true);
  const [mapError, setMapError] = useState(''); 

  // State for booking/reset actions and their feedback
  const [numSeatsToBook, setNumSeatsToBook] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false); 
  const [actionError, setActionError] = useState(''); 
  const [actionSuccess, setActionSuccess] = useState(''); 

  const { user } = useAuth(); // Get user authentication info (esp. token)
  const navigate = useNavigate();

  // --- Function to fetch seat status ---
  const fetchSeatStatus = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoadingSeats(true);
    setMapError('');

    if (!user?.token) {
       setMapError("Please log in to view seat status.");
       setIsLoadingSeats(false);
       setSeats([]);
       return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.get(`${API_BASE_URL}/seats/all-booked-seats`, config);

      if (response.data && Array.isArray(response.data)) {
         const sortedSeats = response.data.sort((a, b) => a.seatNumber - b.seatNumber);
         setSeats(sortedSeats);
      } else {
        console.error("Unexpected response structure:", response.data);
        setMapError("Received invalid data format for seats.");
        setSeats([]);
      }
    } catch (err) {
      console.error("Fetch Seat Status Error:", err);
      setMapError(err.response?.data?.message || `Failed to fetch seat status: ${err.message}`);
      setSeats([]);
    } finally {
      if (showLoading) setIsLoadingSeats(false);
    }
  }, [user?.token]);

  // Fetch seats when component mounts or user token changes
  useEffect(() => {
    fetchSeatStatus();
  }, [fetchSeatStatus]);

  // --- Actions ---

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user?.token) { navigate('/login'); return; }
    if (numSeatsToBook < 1 || numSeatsToBook > 7) {
        setActionError("Please enter a number of seats between 1 and 7.");
        setActionSuccess('');
        return;
    }

    setIsBooking(true);
    setActionError('');
    setActionSuccess('');
    setConfirmReset(false); 

    try {
      const payload = { numSeats: parseInt(numSeatsToBook, 10) };
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.post(`${API_BASE_URL}/seats/create-book`, payload, config);

      if (response.status === 201 && response.data) {
        setActionSuccess(`Successfully booked seats: ${response.data.bookedSeats.join(', ')}!`);
        setNumSeatsToBook(1);
        fetchSeatStatus(false); 
      } else {
         setActionError(response.data?.message || "Booking request failed.");
      }
    } catch (err) {
      console.error("Booking Error:", err);
      setActionError(err.response?.data?.message || `Booking failed: ${err.message}`);
    } finally {
      setIsBooking(false);
    }
  };

  const handleInitiateReset = () => {
      setActionError('');
      setActionSuccess('');
      setConfirmReset(true); 
  }

  const handleCancelReset = () => {
      setConfirmReset(false);
      setActionError(''); 
  }

  const handleConfirmReset = async () => {
    if (!user?.token) { navigate('/login'); return; }

    setIsResetting(true);
    setActionError('');
    setActionSuccess('');

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.delete(`${API_BASE_URL}/seats/reset`, config);

      if (response.status === 200 && response.data?.success) {
        setActionSuccess(response.data.message || "All seats reset!");
        fetchSeatStatus(false); // Refresh seats
      } else {
         setActionError(response.data?.message || "Reset request failed.");
      }
    } catch (err) {
      console.error("Reset Error:", err);
      setActionError(err.response?.data?.message || `Reset failed: ${err.message}`);
    } finally {
      setIsResetting(false);
      setConfirmReset(false); // Hide confirmation step after action
    }
  };

  // --- Rendering Helpers ---

  const renderSeat = (seat) => {
    const isAvailable = seat.status === 'available';
    const seatColor = isAvailable
      ? 'bg-green-100 border-green-400 text-green-800 hover:bg-green-200'
      : 'bg-red-200 border-red-400 text-red-800 cursor-not-allowed';
    const hoverEffect = isAvailable ? 'transition duration-150 ease-in-out' : '';

    return (
      <div
        key={seat.seatNumber}
        className={`w-10 h-10 sm:w-12 sm:h-12 border rounded flex flex-col items-center justify-center text-[10px] sm:text-xs font-medium shadow-sm ${seatColor} ${hoverEffect}`}
        title={`Seat ${seat.seatNumber} - ${seat.status}`}
      >
        <Armchair size={16} className="mb-0.5 sm:mb-1" />
        {seat.seatNumber}
      </div>
    );
  };

  const renderSeatLayout = () => {
    // Simple Grid Layout (7 columns)
    // This doesn't perfectly represent the last row of 3, but is simpler
    // Adjust grid-cols-* if needed based on screen size for better wrapping
     const numRows = Math.ceil(TOTAL_SEATS / SEATS_PER_ROW);
     const seatGrid = Array.from({ length: numRows }, (_, rowIndex) => {
         const rowStart = rowIndex * SEATS_PER_ROW;
         // Handle the last row which might have fewer than 7 seats
         const rowSeatsData = seats.slice(rowStart, rowStart + SEATS_PER_ROW);

        // Explicitly handle the last row (seats 78, 79, 80) for potential centering
        if (rowIndex === numRows - 1 && seats[rowStart]?.seatNumber >= 78) {
             return (
                <div key={`row-${rowIndex}-last`} className="flex justify-center gap-1 sm:gap-2 mb-1 sm:mb-2 w-full">
                    {/* Add a container to center the last 3 seats */}
                     <div className="flex justify-center gap-1 sm:gap-2 w-auto">
                        {rowSeatsData.map(seat => renderSeat(seat))}
                    </div>
                </div>
            );
        }

         return (
             <div key={`row-${rowIndex}`} className="flex justify-center gap-1 sm:gap-2 mb-1 sm:mb-2 flex-wrap">
                 {rowSeatsData.map(seat => renderSeat(seat))}
             </div>
         );
     });

     return <>{seatGrid}</>;
  };

  // --- Main Component Return ---
  return (
    <div className="container mx-auto px-4 py-8 pt-20 min-h-screen"> {/* pt-20 for fixed navbar */}
        {/* Main Layout: Flex column on small screens, row on medium+ */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

        {/* Left Column: Seat Map and Legend */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <h1 className="text-2xl md:text-3xl font-bold text-left mb-4 text-gray-800">Train Coach Seating</h1>
          {/* Legend */}
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-green-100 border border-green-400"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-red-200 border border-red-400"></div>
              <span>Booked</span>
            </div>
          </div>

          {/* Seat Map Area */}
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg shadow-inner min-h-[200px] flex flex-col justify-center">
            {isLoadingSeats && (
              <div className="text-center py-10">
                <Loader2 className="animate-spin inline-block h-8 w-8 text-blue-600" />
                <p className="mt-2 text-gray-600">Loading Seats...</p>
              </div>
            )}
            {!isLoadingSeats && mapError && (
              <div className="text-center py-10 text-red-600 flex flex-col items-center gap-2">
                 <XCircle size={24}/> <span>{mapError}</span>
                 {!user?.token && <button onClick={() => navigate('/login')} className='mt-2 text-sm text-blue-600 underline'>Login to view</button>}
              </div>
            )}
            {!isLoadingSeats && !mapError && seats.length === 0 && user?.token && (
                <div className="text-center py-10 text-gray-500">No seat data available. Try resetting if needed.</div>
            )}
             {!isLoadingSeats && !mapError && seats.length > 0 && (
                renderSeatLayout()
             )}
          </div>
        </div>

        {/* Right Column: Actions (Booking/Reset) */}
        <div className="w-full md:w-1/3 lg:w-1/4">
             <div className="sticky top-20 bg-white p-4 rounded-lg shadow-md border border-gray-200"> {/* Sticky position */}
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Actions</h2>

                 {/* Action Error Display */}
                 {actionError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm flex items-center gap-2">
                       <XCircle size={16} /> <span>{actionError}</span>
                    </div>
                 )}

                 {/* Action Success Display */}
                 {actionSuccess && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm flex items-center gap-2">
                       <CheckCircle size={16} /> <span>{actionSuccess}</span>
                    </div>
                 )}

                {/* --- Booking Form --- */}
                {user?.token ? (
                    <form onSubmit={handleBooking} className="mb-6 pb-6 border-b border-gray-200">
                         <label htmlFor="numSeats" className="block text-sm font-medium text-gray-600 mb-1">Number of Seats (1-7)</label>
                         <div className="flex items-center gap-2">
                             <input
                                type="number"
                                id="numSeats"
                                min="1"
                                max="7"
                                value={numSeatsToBook}
                                onChange={(e) => setNumSeatsToBook(e.target.value)}
                                required
                                className="flex-grow w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                                placeholder="1-7"
                                disabled={isBooking || isResetting}
                             />
                             <button
                                type="submit"
                                disabled={isBooking || isResetting || isLoadingSeats}
                                className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center justify-center transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                             >
                                 {isBooking ? ( <Loader2 className="animate-spin mr-1.5 h-4 w-4" /> ) : ( <Ticket className="mr-1.5 h-4 w-4" /> )}
                                 Book
                             </button>
                         </div>
                    </form>
                 ) : (
                    <div className="text-center text-gray-500 text-sm mb-6 pb-6 border-b border-gray-200">
                        Please <button onClick={() => navigate('/login')} className='text-blue-600 underline'>log in</button> to book seats.
                    </div>
                 )}


                 {/* --- Reset Section --- */}
                 {user?.token && (
                    <div>
                        {!confirmReset ? (
                             // Initial Reset Button
                             <>
                                <p className='text-sm text-gray-600 mb-2'>Need to clear all bookings?</p>
                                <button
                                    onClick={handleInitiateReset}
                                    disabled={isBooking || isResetting || isLoadingSeats}
                                    className="w-full px-4 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 flex items-center justify-center transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                     {/* No loader here, as initiating isn't async */}
                                    <Trash2 className="mr-1.5 h-4 w-4" />
                                    Reset All Bookings
                                </button>
                             </>
                         ) : (
                            // Confirmation Step
                            <div className="bg-yellow-50 border border-yellow-300 p-3 rounded-md">
                                <p className="text-sm font-medium text-yellow-800 mb-3 flex items-center gap-1.5">
                                   <AlertTriangle size={16}/> Are you sure? This will clear ALL seats.
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleConfirmReset}
                                        disabled={isResetting}
                                        className="flex-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-xs flex items-center justify-center"
                                    >
                                         {isResetting ? (<Loader2 className="animate-spin mr-1 h-3 w-3" />) : null}
                                        Yes, Reset
                                    </button>
                                    <button
                                        onClick={handleCancelReset}
                                        disabled={isResetting}
                                        className="flex-1 px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-50 text-xs"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                 )}
            </div> 
        </div> 

      </div> 
    </div> 
  );
};

export default BookPage;