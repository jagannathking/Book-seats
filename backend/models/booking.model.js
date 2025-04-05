// models/Booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    bookedSeatNumbers: {
        type: [Number], // Array of seat numbers
        required: true,
        validate: [val => val.length > 0, 'Must book at least one seat']
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Optional: Index userId for faster lookup of a user's bookings
BookingSchema.index({ userId: 1 });



const Booking = mongoose.model('Booking', BookingSchema);
module.exports = Booking;