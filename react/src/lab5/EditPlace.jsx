
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import './EditPlace.css'

const EditPlace = () => {
    const { addPlace, updatePlace, username, places } = useAuth();
    const navigate = useNavigate();
    const { pid } = useParams(); // Get place ID from URL
    const [place, setPlace] = useState({ name: '', image: '', description: '' });
    const [error, setError] = useState(''); // State to hold error messages

    // Load existing place data for editing
    useEffect(() => {
        if (pid) {
            const existingPlace = Object.values(places).flat().find(place => place._id === pid);
            if (existingPlace) {
                setPlace(existingPlace);
            }
        }
    }, [pid, places]);

  

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
            <h2>{pid ? 'Мэдээллийг өөрчлөх' : 'Газар нэмэх'}</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    нэр:
                    <input
                        type="text"
                        value={place.name}
                        onChange={(e) => setPlace({ ...place, name: e.target.value })}
                        required
                    />
                </label>
                <br />
                <label>
                    Зураг:
                    <input
                        type="text"
                        value={place.image}
                        onChange={(e) => setPlace({ ...place, image: e.target.value })}
                        required
                    />
                </label>
                <br />
                <label>
                    Тайлбар:
                    <textarea
                        value={place.description}
                        onChange={(e) => setPlace({ ...place, description: e.target.value })}
                        required
                    />
                </label>
                <br />
                {error && <p className="error-message">{error}</p>}
                <br />
                <button type="submit">{pid ? 'Газрын мэдээлэл шинэчлэх' : 'Газар нэмэх'}</button>
            </form>


        </div>
    );
};

export default EditPlace;