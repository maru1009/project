// controllers/placeController.js
const User = require('../models/User');
const Place = require('../models/Place');

// Get places for a user
const getPlaces = async (req, res) => {
    const { uid } = req.params;

    try {
        const user = await User.findById(uid);  // Get user by ObjectId
        if (user) {
            const places = await Place.find({ userId: user._id }); // Get places by userId
            return res.status(200).json({ places });
        } else {
            return res.status(404).json({ message: 'Хэрэглэгч олдсонгүй' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Газрын мэдээллийг татахад алдаа гарлаа.' });
    }
};

// Add a new place for a user
const addPlace = async (req, res) => {
    const { username } = req.params;
    const { name, image, description } = req.body;

    try {
        const user = await User.findOne({ name: username });
        if (!user) {
            return res.status(404).json({ message: 'Хэрэглэгч олдсонгүй' });
        }

        const newPlace = new Place({
            name,
            image,
            description,
            userId: user._id
        });

        await newPlace.save();
        return res.status(201).json(newPlace);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Газар нэмэхэд алдаа гарлаа.' });
    }
};

// Update a place for a user
const updatePlace = async (req, res) => {
    const { username, placeId } = req.params;
    const { name, image, description } = req.body;

    try {
        const user = await User.findOne({ name: username });
        if (!user) {
            return res.status(404).json({ message: 'Хэрэглэгч олдсонгүй' });
        }

        const place = await Place.findOne({ _id: placeId, userId: user._id });
        if (!place) {
            return res.status(404).json({ message: 'Газар олдсонгүй' });
        }

        place.name = name || place.name;
        place.image = image || place.image;
        place.description = description || place.description;

        await place.save();
        return res.status(200).json(place);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Газрыг шинчлэхэд алдаа гарлаа.' });
    }
};

// Delete a place for a user
const deletePlace = async (req, res) => {
    const { username, placeId } = req.params;

    try {
        const user = await User.findOne({ name: username });
        if (!user) {
            return res.status(404).json({ message: 'Хэрэглэгч олдсонгүй' });
        }

        const place = await Place.findOneAndDelete({ _id: placeId, userId: user._id });
        if (!place) {
            return res.status(404).json({ message: 'Газар олдсонгүй' });
        }

        return res.status(204).send(); // No content to send back on successful deletion
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Газар устгахад алдаа гарлаа' });
    }
};

module.exports = {
    getPlaces,
    addPlace,
    updatePlace,
    deletePlace
};
