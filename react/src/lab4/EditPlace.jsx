// src/lab4/EditPlace.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import './EditPlace.css';

const EditPlace = () => {
    const { addPlace, updatePlace, username, places } = useAuth();
    const navigate = useNavigate();
    const { pid } = useParams(); // Get place ID from URL
    const [place, setPlace] = useState({ name: '', image: '', description: '', latitude: '', longitude: '', address: '' });
    const [error, setError] = useState(''); // State to hold error messages

    // Load existing place data for editing
    useEffect(() => {
        if (pid) {
            const existingPlace = Object.values(places).flat().find(place => place.id === pid);
            if (existingPlace) {
                setPlace(existingPlace);
            }
        }
    }, [pid, places]);

    const fetchCoordinates = async (address) => {
        try {
            const response = await axios.get(`https://api.positionstack.com/v1/forward`, {
                params: {
                    access_key: 'YOUR_POSITIONSTACK_API_KEY', // Replace with your PositionStack API key
                    query: address,
                },
            });
            if (response.data && response.data.data.length > 0) {
                const { latitude, longitude } = response.data.data[0];
                setPlace(prev => ({ ...prev, latitude, longitude }));
                setError(''); // Clear error message
            } else {
                setError('Unable to fetch coordinates. Please check the address.');
            }
        } catch (err) {
            console.error(err);
            setError('Unable to fetch coordinates. Please check the address.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (pid) {
            // Update existing place if pid is provided
            updatePlace(username, place); // Assuming updatePlace is a function in UserContext
        } else {
            // Add new place if no pid is provided
            const newPlace = {
                ...place,
                id: Date.now().toString(), // Generate a unique ID
            };
            addPlace(username, newPlace);
        }

        // Redirect to the user's places page after adding/updating
        navigate(`/${username}/places`);
    };

    return (
        <div className="edit-place-container">
            <h2>{pid ? 'Edit Place' : 'Add New Place'}</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        value={place.name}
                        onChange={(e) => setPlace({ ...place, name: e.target.value })}
                        required
                    />
                </label>
                <br />
                <label>
                    Image URL:
                    <input
                        type="text"
                        value={place.image}
                        onChange={(e) => setPlace({ ...place, image: e.target.value })}
                        required
                    />
                </label>
                <br />
                <label>
                    Description:
                    <textarea
                        value={place.description}
                        onChange={(e) => setPlace({ ...place, description: e.target.value })}
                        required
                    />
                </label>
                <br />
                <label>
                    Address:
                    <input
                        type="text"
                        value={place.address}
                        onChange={(e) => setPlace({ ...place, address: e.target.value })}
                        required
                    />
                </label>
                <button type="button" onClick={() => fetchCoordinates(place.address)}>
                    Get Coordinates
                </button>
                {error && <p className="error-message">{error}</p>}
                <br />
                <button type="submit">{pid ? 'Update Place' : 'Add Place'}</button>
            </form>

            {/* Google Maps link */}
            {place.latitude && place.longitude && (
                <a
                    className="google-maps-link"
                    href={`https://www.google.com/maps?q=${place.latitude},${place.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View on Google Maps
                </a>
            )}
        </div>
    );
};

export default EditPlace;