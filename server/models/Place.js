// models/Place.js
const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: String, required: true } // Change to String
});

module.exports = mongoose.model('Place', placeSchema);
