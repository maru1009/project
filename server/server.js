// server.js (or app.js)
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/placesdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Middleware setup
app.use(cors({ origin: 'http://localhost:5173' })); // React frontend
app.use(express.json()); // Middleware to parse JSON

// Define Mongoose models
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

const placeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Place = mongoose.model('Place', placeSchema);

// Get all users
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Register new user
app.post('/api/users/register', async (req, res) => {
    const { name, password } = req.body;

    try {
        const existingUser = await User.findOne({ name });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const newUser = new User({ name, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
});

// User login
app.post('/api/users/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await User.findOne({ name, password });
        if (user) {
            res.json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Get places for a user
app.get('/api/places/user/:uid', async (req, res) => {
    const { uid } = req.params;

    try {
        const user = await User.findById(uid);  // Get user by ObjectId
        if (user) {
            const places = await Place.find({ userId: user._id }); // Get places by userId
            res.json({ places });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching places' });
    }
});

// Add a new place for a user
app.post('/api/users/:username/places', async (req, res) => {
    const { username } = req.params;
    const { name, image, description } = req.body;

    try {
        const user = await User.findOne({ name: username });
        if (user) {
            const newPlace = new Place({ name, image, description, userId: user._id });
            await newPlace.save();
            res.status(201).json(newPlace);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error adding place' });
    }
});

// Update a place for a user
app.put('/api/users/:username/places/:placeId', async (req, res) => {
    const { username, placeId } = req.params;
    const { name, image, description } = req.body;

    try {
        const user = await User.findOne({ name: username });
        if (user) {
            const place = await Place.findOne({ _id: placeId, userId: user._id });
            if (place) {
                place.name = name || place.name;
                place.image = image || place.image;
                place.description = description || place.description;
                await place.save();
                res.json(place);
            } else {
                res.status(404).json({ message: 'Place not found' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating place' });
    }
});

// Delete a place for a user
app.delete('/api/users/:username/places/:placeId', async (req, res) => {
    const { username, placeId } = req.params;

    try {
        const user = await User.findOne({ name: username });
        if (user) {
            const place = await Place.findOneAndDelete({ _id: placeId, userId: user._id });
            if (place) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Place not found' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting place' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
