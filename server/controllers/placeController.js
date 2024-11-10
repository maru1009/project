const Place = require('../models/Place');
const User = require('../models/User');

// Get places for a user
const getPlacesForUser = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ name: username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userPlaces = await Place.find({ userId: user._id });
        res.json({ places: userPlaces });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching places', error: err });
    }
};

// Add a new place for a user
const addPlaceForUser = async (req, res) => {
    const { username } = req.params;
    const { name, image, description } = req.body;

    try {
        const user = await User.findOne({ name: username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newPlace = new Place({ name, image, description, userId: user._id });
        await newPlace.save();
        res.status(201).json(newPlace);
    } catch (err) {
        res.status(500).json({ message: 'Error adding place', error: err });
    }
};

// Update a place for a user
const updatePlaceForUser = async (req, res) => {
    const { username, placeId } = req.params;
    const { name, image, description } = req.body;

    try {
        const user = await User.findOne({ name: username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const place = await Place.findOneAndUpdate(
            { _id: placeId, userId: user._id },
            { name, image, description },
            { new: true }
        );

        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }

        res.json(place);
    } catch (err) {
        res.status(500).json({ message: 'Error updating place', error: err });
    }
};

// Delete a place for a user
const deletePlaceForUser = async (req, res) => {
    const { username, placeId } = req.params;

    try {
        const user = await User.findOne({ name: username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const place = await Place.findOneAndDelete({ _id: placeId, userId: user._id });
        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error deleting place', error: err });
    }
};

module.exports = { getPlacesForUser, addPlaceForUser, updatePlaceForUser, deletePlaceForUser };
