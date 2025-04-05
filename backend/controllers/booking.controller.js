// controllers/booking.controller.js
const mongoose = require('mongoose');
const Booking = require('../models/booking.model');
const { calculateAvailableSeats, findContiguousSeatsInRows, getFirstAvailableSeats } = require('../utils/seatCalculator');

// fetchAllBookedSeatNumbers function remains the same - it's good.
async function fetchAllBookedSeatNumbers(session = null) {
    const queryOptions = {};
    if (session) {
        queryOptions.session = session;
    }
    const bookings = await Booking.find({}, { bookedSeatNumbers: 1, _id: 0 }, queryOptions);
    let allSeats = [];
    for (const booking of bookings) {
        if (booking.bookedSeatNumbers && booking.bookedSeatNumbers.length > 0) {
            allSeats.push(...booking.bookedSeatNumbers);
        }
    }
    const uniqueSeats = [...new Set(allSeats)];
    return uniqueSeats;
}


exports.getSeatStatus = async (req, res) => {
    try {
        const bookedSeatNumbers = await fetchAllBookedSeatNumbers();
        const allSeats = Array.from({ length: 80 }, (_, i) => i + 1);
        const status = allSeats.map(seat => ({
            seatNumber: seat,
            status: bookedSeatNumbers.includes(seat) ? 'booked' : 'available'
        }));
        res.status(200).json(status);
    } catch (error) {
        console.error("Get Seat Status Error:", error);
        res.status(500).json({ message: 'Failed to retrieve seat status.' });
    }
};


exports.createBooking = async (req, res) => {
    const { numSeats } = req.body;

    // Access the user ID based on the structure attached by your auth middleware.
    // Assuming the middleware attaches { id: '...', name: '...', email: '...' } to req.user
    const userId = req.user?.id; // Use optional chaining ?. just in case

    // Add a check to ensure userId was actually found.
    if (!userId) {
        console.error("User ID missing from req.user. Auth middleware might have failed or payload structure is different.");
        // Don't proceed if we don't know who is booking.
        // 401 is appropriate as authentication info is missing/invalid at this stage.
        return res.status(401).json({ message: 'Authentication error: User ID not found.' });
    }


    if (!Number.isInteger(numSeats) || numSeats < 1 || numSeats > 7) {
        return res.status(400).json({ message: 'Number of seats must be between 1 and 7.' });
    }

    const session = await mongoose.startSession();
    session.startTransaction({
        readConcern: { level: 'snapshot' }, // Ensures consistent reads within the transaction
        writeConcern: { w: 'majority' }    // Ensures writes are acknowledged by a majority of replicas
    });

    try {
        const bookedSeatNumbers = await fetchAllBookedSeatNumbers(session);
        const availableSeats = calculateAvailableSeats(bookedSeatNumbers);

        if (availableSeats.length < numSeats) {
            throw new Error('Not enough seats available in the coach.');
        }

        let seatsToBook = findContiguousSeatsInRows(availableSeats, numSeats);

        if (!seatsToBook || seatsToBook.length === 0) {
            seatsToBook = getFirstAvailableSeats(availableSeats, numSeats);
        }

        if (!seatsToBook || seatsToBook.length !== numSeats) {
            // Added a more specific error message here
            throw new Error(`Failed to select the required ${numSeats} seats.`);
        }

        // This uses the 'userId' variable defined and checked above
        const newBookingData = { userId: userId, bookedSeatNumbers: seatsToBook };
        const bookingResult = await Booking.create([newBookingData], { session: session });
        const newBooking = bookingResult[0];

        await session.commitTransaction();

        res.status(201).json({
            message: 'Booking successful!',
            bookingId: newBooking._id,
            bookedSeats: newBooking.bookedSeatNumbers
        });

    } catch (error) {
        // Check if a transaction was actually started before trying to abort
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        console.error("Booking Error:", error.message);
        
        let statusCode = 500; // Default to Internal Server Error
        if (error.message.includes('Not enough seats available')) {
            statusCode = 409; // Conflict - Resource state prevents request
        } else if (error.message.startsWith('Failed to select')) {
            statusCode = 500; // Internal logic error potentially
        } else if (error.name === 'ValidationError') { // Handle Mongoose validation errors
            statusCode = 400; // Bad Request
        }

        res.status(statusCode).json({ message: error.message || 'Booking failed.' });
    } finally {
        await session.endSession();
    }
}


// reset all bookings
exports.resetAllBookings = async (req, res) => {
    try {
        // Delete ALL documents from the Booking collection
        const deleteResult = await Booking.deleteMany({}); // {} empty filter means match all

        // deleteResult contains information like { acknowledged: true, deletedCount: 5 }
        console.log(`Reset successful: ${deleteResult.deletedCount} bookings deleted.`);

        res.status(200).json({
            success: true,
            message: `All bookings reset successfully. ${deleteResult.deletedCount} bookings deleted.`,
            deletedCount: deleteResult.deletedCount
        });

    } catch (error) {
        console.error("Reset Bookings Error:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset bookings.',
            error: error.message
         });
    }
};