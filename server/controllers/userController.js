const User = require('../models/User');

// Register new user
const registerUser = async (req, res) => {
    const { name, password } = req.body;
    try {
        const existingUser = await User.findOne({ name });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const newUser = new User({ name, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err });
    }
};

// User login
const loginUser = async (req, res) => {
    const { name, password } = req.body;
    try {
        const user = await User.findOne({ name, password });
        if (user) {
            res.json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err });
    }
};

module.exports = { registerUser, loginUser };
