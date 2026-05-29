// middleware/auth.js
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    let token;

    // Check if the token exists in the request headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (Format: "Bearer TOKEN_STRING")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using your secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

            // Attach the logged-in user's ID to the request object
            req.user = decoded.id;

            // Move on to the actual controller function
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };