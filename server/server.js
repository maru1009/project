const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/placesdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


// Middleware setup
app.use(cors({ origin: 'http://localhost:5173' })); // React frontend
app.use(express.json()); // Middleware to parse JSON

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
