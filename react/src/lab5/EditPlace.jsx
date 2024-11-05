// src/lab4/EditPlace.jsx
import React, { useEffect, useState } from 'react';
import { usePlaces } from './PlaceContext'; // Import PlaceContext
import { useNavigate, useParams } from 'react-router-dom';
import './EditPlace.css';

const EditPlace = () => {
    const { addPlace, updatePlace, places } = usePlaces();
    const navigate = useNavigate();
    const { pid } = useParams(); 
    const [place, setPlace] = useState({ name: '', image: '', description: ''});
    const [error, setError] = useState('');

    useEffect(() => {
        if (pid) {
            const existingPlace = places.find(place => place._id === pid);
            if (existingPlace) {
                setPlace(existingPlace);
            }
        }
    }, [pid, places]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (pid) {
            await updatePlace(pid, place); // Update existing place
        } else {
            await addPlace(place); // Add new place
        }

        navigate(`/${place.userId}/places`); // Redirect to the user's places page
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
                <button type="submit">{pid ? 'Update Place' : 'Add Place'}</button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default EditPlace;
