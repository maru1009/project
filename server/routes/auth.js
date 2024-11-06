// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router(); // Initialize the router

// Function to get the next sequential user ID
const getNextUserId = async () => {
    // Logic to fetch the next user ID from the database
    const lastUser = await User.findOne().sort({ id: -1 });
    return lastUser ? lastUser.id + 1 : 1; // Start from 1 if no users exist
};

// Sign Up
router.post('/signup', async (req, res) => {
    const { username, name, email, password } = req.body;

    try {
        // Check if the username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await getNextUserId(); // Get the next sequential user ID
        const newUser = new User({
            id: userId,
            username,
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ user: newUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch All Users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude the password field
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
