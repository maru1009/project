const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');

require('dotenv').config();

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
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, // Enable cookies for CORS
}));
app.use(express.json()); // Middleware to parse JSON
app.use(cookieParser()); // For cookie parsing

// Set up session middleware
app.use(session({
    secret: process.env.SESSION_SECRET, // Use a strong secret key
    resave: false, // Avoid resaving unchanged sessions
    saveUninitialized: false, // Avoid saving uninitialized sessions
    cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour (session expiration)
        httpOnly: true, // Prevent JavaScript access to cookies
        secure: process.env.NODE_ENV === 'production', // Secure cookies in production
    },
}));

// Import routes
const userRoutes = require('./routes/userRoutes');
const placeRoutes = require('./routes/placeRoutes');


// Use routes
app.use('/api/users', userRoutes);
app.use('/api/places', placeRoutes);


// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
