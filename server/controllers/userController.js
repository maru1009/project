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
        req.session.userId = user._id;
        req.session.username = user.name
        res.status(200).json({ message: 'Амжилттай нэвтэрлээ', user });
    } catch (error) {
        res.status(500).json({ message: 'Нэвтрэхэд алдаа гарлаа.' });
    }
};
;




// Logout user
const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Сешн устгахад алдаа гарлаа:', err);
            return res.status(500).json({ message: 'Гарахад алдаа гарлаа.' });
        }
        res.status(200).json({ message: 'Амжилттай гарлаа.' });
    });
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
const validateSession = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Хэрэглэгч нэвтрээгүй байна.' });
    }

    res.status(200).json({
        message: 'Session баталгаажлаа',
        username: req.session.username,
    });
};

module.exports = { getAllUsers, registerUser, loginUser, logoutUser, validateSession };
