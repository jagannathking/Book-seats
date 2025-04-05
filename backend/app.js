const express = require('express');
const cors = require('cors');


const database = require('./config/database');
const userRoutes = require('./routes/user.routes');
const bookRoutes = require('./routes/booking.routes');



const app = express();

// Connect database
database();



// Middleware
app.use(express.json());
app.use(cors());



// All routes
app.use("/api/users", userRoutes);
app.use("/api/seats", bookRoutes);




// Test toutes
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Healthy"
    })
})



module.exports = app;