const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json()); // Middleware to parse JSON

// Predefined users and places
const predefinedUsers = [
    { id: 1, name: 'user1', password: 'pass1' },
    { id: 2, name: 'user2', password: 'pass2' },
];

const predefinedPlaces = {
    user1: [
        { id: '1', name: 'Place A1', image: 'https://via.placeholder.com/150', description: 'Gazar1' },
        { id: '2', name: 'Place A2', image: 'https://via.placeholder.com/150', description: 'Gazar2' },
    ],
    user2: [
        { id: '3', name: 'Place B1', image: 'https://via.placeholder.com/150', description: 'Gazar 1' },
        { id: '4', name: 'Place B2', image: 'https://via.placeholder.com/150', description: 'Gazar 2' },
    ],
};

// Get all users
app.get("/api/users", (req, res) => {
    res.status(200).json({ users: predefinedUsers });
});

// Register new user
app.post('/api/users/register', (req, res) => {
    const { name, password } = req.body;
    if (predefinedUsers.some(user => user.name === name)) {
        return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = { id: predefinedUsers.length + 1, name, password };
    predefinedUsers.push(newUser);
    predefinedPlaces[name] = []; // Initialize empty places for the new user

    res.status(201).json(newUser);
});

// User login
app.post('/api/users/login', (req, res) => {
    const { name, password } = req.body;

    // Find user
    const user = predefinedUsers.find(user => user.name === name && user.password === password);
    if (user) {
        res.json({ message: 'Login successful', user });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

// Get places for a user
app.get('/api/users/:username/places', (req, res) => {
    const { username } = req.params;
    const userPlaces = predefinedPlaces[username];

    if (userPlaces) {
        res.json({ places: userPlaces });
    } else {
        res.status(404).json({ message: 'User or places not found' });
    }
});

// Add a new place for a user
app.post('/api/users/:username/places', (req, res) => {
    const { username } = req.params;
    const newPlace = { id: Date.now().toString(), ...req.body };

    if (predefinedPlaces[username]) {
        predefinedPlaces[username].push(newPlace);
        res.status(201).json(newPlace);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Update a place for a user
app.put('/api/users/:username/places/:placeId', (req, res) => {
    const { username, placeId } = req.params;
    const userPlaces = predefinedPlaces[username];

    if (userPlaces) {
        const placeIndex = userPlaces.findIndex(place => place.id === placeId);
        if (placeIndex !== -1) {
            userPlaces[placeIndex] = { ...userPlaces[placeIndex], ...req.body };
            res.json(userPlaces[placeIndex]);
        } else {
            res.status(404).json({ message: 'Place not found' });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Delete a place for a user
app.delete('/api/users/:username/places/:placeId', (req, res) => {
    const { username, placeId } = req.params;
    const userPlaces = predefinedPlaces[username];

    if (userPlaces) {
        predefinedPlaces[username] = userPlaces.filter(place => place.id !== placeId);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// New API endpoint to fetch all places for a user by uid
app.get('/api/places/user/:uid', (req, res) => {
    const { uid } = req.params;
    const user = predefinedUsers.find(user => user.id === parseInt(uid));

    if (user) {
        const userPlaces = predefinedPlaces[user.name] || [];
        res.json({ places: userPlaces });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
