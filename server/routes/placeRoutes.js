const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Place = require('../models/Place');

// Get places for a user
router.get('/user/:uid', async (req, res) => {
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
router.post('/:username/places', async (req, res) => {
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
router.put('/:username/places/:placeId', async (req, res) => {
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

router.delete('/:username/places/:placeId', async (req, res) => {
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



module.exports = router;
