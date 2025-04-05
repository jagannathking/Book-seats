const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config()
// Register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // user input validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check user already exist or not
        const existUser = await User.findOne({ email });

        if (existUser) {
            return res.status(409).json({
                success: false,
                message: "User already exist, Please login"
            })
        }

        // hash the password
        const hashPassword = bcrypt.hashSync(password, 10);

        // create new user
        const user = new User({ name, email, password: hashPassword });

        await user.save();

        res.status(201).json({
            success: true,
            message: "User created successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}


// Login user
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // user input validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "email and password are required"
            })
        }

        // user exist or not
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not exist, Please Register"
            })
        }

        // compare the passeword
        const comparePassword = bcrypt.compareSync(password, user.password);
        
        // create jwt token
        const token = jwt.sign({ id: user._id, name: user.name, email: user.email },
            process.env.JWT_SCRETE,
            { expiresIn: '7d' })

        
        res.status(200).json({
            success: true,
            message: "User logined successfully",
            token
        })    
    } catch (error) {
      
        res.status(500).json({
            success: false,
            message: "Error while loging",
            error: error.message
        })
    }
}


module.exports = {registerUser, loginUser}