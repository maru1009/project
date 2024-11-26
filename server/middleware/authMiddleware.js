const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token; // Retrieve token from cookies
    if (!token) {
        return res.status(401).json({ message: 'Нэвтрээгүй байна' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT
        req.user = await User.findById(decoded.id); // Attach user data
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Буруу токен' });
    }
};

module.exports = authMiddleware;
