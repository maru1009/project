const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Place', placeSchema);
