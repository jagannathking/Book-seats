const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SCRETE; 

const authMiddleware = async (req, res, next) => {
  try {
   
    const authHeader = req.header('Authorization');

    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ // Use 401 Unauthorized
        success: false,
        message: "Access denied. No token provided or invalid format."
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    if (!token) {
         return res.status(401).json({
            success: false,
            message: "Access denied. Token missing."
         });
    }


    const decodedPayload = jwt.verify(token, JWT_SECRET_KEY);

    req.user = decodedPayload; 

    next(); 

  } catch (error) {
   
    console.error("Auth Middleware Error:", error.message);
    res.status(403).json({   
      success: false,
      message: "Authentication failed: Invalid or expired token."
    });
  }
};

module.exports = authMiddleware;