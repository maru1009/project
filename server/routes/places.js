// routes/places.js
const express = require('express');
const Place = require('../models/Place');  // Import the Place model
const router = express.Router();

// Get place information by ID (pid)
router.get('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const place = await Place.findById(pid);
        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }
        res.status(200).json(place);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching place' });
    }
});

// Create a new place
router.post('/', async (req, res) => {
    const { name, image, description, userId } = req.body;

    try {
        const newPlace = new Place({ name, image, description, userId });
        await newPlace.save();
        res.status(201).json(newPlace);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding place' });
    }
});

// Update place information (PATCH) by ID (pid)
router.patch('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { name, image, description } = req.body;

    try {
        const updatedPlace = await Place.findByIdAndUpdate(
            pid, 
            { name, image, description },
            { new: true }
        );
        if (!updatedPlace) {
            return res.status(404).json({ message: 'Place not found' });
        }
        res.status(200).json(updatedPlace);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating place' });
    }
});

// Delete place by ID (pid)
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const place = await Place.findByIdAndDelete(pid);
        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting place' });
    }
});

module.exports = router;
