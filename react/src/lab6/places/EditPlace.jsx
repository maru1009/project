import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/EditPlace.css';

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

    // Validate form fields
    const validateForm = () => {
        if (!place.name.trim()) {
            return 'Нэр талбар хоосон байж болохгүй';
        }
        if (!place.image.trim()) {
            return 'Зураг талбар хоосон байж болохгүй';
        }
        if (!place.description.trim()) {
            return 'Тайлбар талбар хоосон байж болохгүй';
        }
        // Validate image URL format (simple check)
        const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
        if (place.image && !urlPattern.test(place.image)) {
            return 'Зураг URL хоосон биш ч гэсэн зөв URL биш байна';
        }

        return ''; // No errors
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate the form
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return; // Don't submit if validation fails
        }

        setError(''); // Clear previous errors

        if (pid) {
            // Update existing place if pid is provided
            updatePlace(username, place);
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
                {error && <p className="error-message">{error}</p>} {/* Display error messages */}
                <br />
                <button type="submit">{pid ? 'Газрын мэдээлэл шинэчлэх' : 'Газар нэмэх'}</button>
            </form>
        </div>
    );
};

export default EditPlace;
