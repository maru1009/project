const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register a new user
const registerUser = async (req, res) => {
    const { name, password } = req.body;

    try {
        const existingUser = await User.findOne({ name });
        if (existingUser) {
            return res.status(409).json({ message: 'Дараах хэрэглэгч бүртгэлтэй байна.' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Хэрэглэгч амжилттай бүртгэгдлээ.', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Хэрэглэгчийн бүртгэхэд алдаа гарлаа.' });
    }
};

// User login
const loginUser = async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(401).json({ message: 'Хэрэглэгчийн нэр эсвэл нууц үг буруу байна.' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Хэрэглэгчийн нэр эсвэл нууц үг буруу байна.' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set token as a cookie
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.status(200).json({ message: 'Амжилттай нэвтэрлээ', user });
    } catch (error) {
        res.status(500).json({ message: 'Нэвтрэхэд алдаа гарлаа.' });
    }
};

// Logout user
const logoutUser = (req, res) => {
    res.clearCookie('token'); // Clear the JWT cookie
    res.status(200).json({ message: 'Амжилттай гарлаа.' });
};

// Get all users (admin or protected route)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Хэрэглэгчийн татахад алдаа гарлаа' });
    }
};

// Validate session with JWT token
const validateSession = (req, res) => {
    const token = req.cookies.token; // Assume the token is stored in a cookie

    if (!token) {
        return res.status(401).json({ message: 'Токен алга байна' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Validate token
        res.status(200).json({ username: decoded.name });
    } catch (error) {
        res.status(401).json({ message: 'Буруу эсвэл хугацаа нь дууссан токен байна.' });
    }
};

module.exports = { getAllUsers, registerUser, loginUser, logoutUser, validateSession };
