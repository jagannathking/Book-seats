const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config()

const database = async() => {
    try{
     await mongoose.connect(process.env.MONGO_URI);
     console.log("Database connected successfully")
    }catch(error) {
      console.log("Failed to connect database", error.message)
    }
}


module.exports = database