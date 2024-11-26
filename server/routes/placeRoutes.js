// routes/placeRoutes.js
const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect the route to get and add places (uncomment after implementing authMiddleware)
// router.use(authMiddleware);

// Get places for a user
router.get('/user/:uid', placeController.getPlaces);

// Add a new place for a user
router.post('/:username/places', placeController.addPlace);

// Update a place for a user
router.put('/:username/places/:placeId', placeController.updatePlace);

// Delete a place for a user
router.delete('/:username/places/:placeId', placeController.deletePlace);

module.exports = router;
