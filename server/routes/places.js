// routes/places.js
const express = require('express');
const Place = require('../models/Place');

const router = express.Router();

// Create new place
router.post('/', async (req, res) => {
    const { name, image, description, userId } = req.body;

    // Validate request body
    if (!name || !image || !description || !userId) {
        return res.status(400).json({ message: 'All fields (name, image, description, userId) are required.' });
    }

    try {
        const newPlace = new Place({
            name,
            image,
            description,
            userId, // Store the userId in the Place document
        });

        const savedPlace = await newPlace.save();
        res.status(201).json(savedPlace);
    } catch (error) {
        console.error('Error saving place:', error);
        res.status(500).json({ message: 'Failed to add place.', error: error.message });
    }
});



// Get place by ID
router.get('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const place = await Place.findById(pid);
        if (!place) {
            return res.status(404).json({ message: 'Place not found.' });
        }
        res.status(200).json(place);
    } catch (error) {
        console.error('Error fetching place:', error);
        res.status(500).json({ message: 'Failed to retrieve place.', error: error.message });
    }
});

// Update place by ID
router.patch('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { name, image, description } = req.body;

    // Validate request body
    if (!name && !image && !description) {
        return res.status(400).json({ message: 'At least one field (name, image, description) is required to update.' });
    }

    try {
        const updatedPlace = await Place.findByIdAndUpdate(
            pid,
            { name, image, description },
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedPlace) {
            return res.status(404).json({ message: 'Place not found.' });
        }
        res.status(200).json(updatedPlace);
    } catch (error) {
        console.error('Error updating place:', error);
        res.status(500).json({ message: 'Failed to update place.', error: error.message });
    }
});

// Delete place by ID
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const deletedPlace = await Place.findByIdAndDelete(pid);
        if (!deletedPlace) {
            return res.status(404).json({ message: 'Place not found.' });
        }
        res.status(200).json({ message: 'Place deleted successfully.' });
    } catch (error) {
        console.error('Error deleting place:', error);
        res.status(500).json({ message: 'Failed to delete place.', error: error.message });
    }
});

module.exports = router;
