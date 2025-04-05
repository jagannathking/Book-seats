const express = require('express');


const {getSeatStatus, createBooking, resetAllBookings} = require('../controllers/booking.controller')
const authMiddleware = require('../middlewares/auth.middleware');



const router = express.Router();




router.get("/all-booked-seats", authMiddleware, getSeatStatus);
router.post("/create-book", authMiddleware, createBooking);
router.delete("/reset", authMiddleware, resetAllBookings);



module.exports = router;