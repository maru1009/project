import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './UserContext';
import './PlaceList.css';

const PlaceList = () => {
    const { uid } = useParams(); // Get user ID from URL params
    const { fetchUserPlaces } = useAuth(); // Get the fetchUserPlaces function from context
    const [userPlaces, setUserPlaces] = useState([]); // State to store user's places
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlaces = async () => {
            setLoading(true); // Set loading to true before fetching
            try {
                const places = await fetchUserPlaces(uid); // Fetch places for the user
                setUserPlaces(places); // Set the fetched places to state
            } catch (error) {
                setError(error.message); // Set error message if fetching fails
            } finally {
                setLoading(false); // Set loading to false regardless of success or failure
            }
        };

        fetchPlaces();
    }, [uid, fetchUserPlaces]);

    if (loading) return <p>Loading places...</p>; // Loading message
    if (error) return <p>Error: {error}</p>; // Display error message

    return (
        <div className="place-list-container">
            <button className="back-button" onClick={() => navigate('/')}>Back to Home</button>
            <h2>{uid}'s Places</h2>
            {userPlaces.length === 0 ? (
                <p>No places found for this user.</p>
            ) : (
                userPlaces.map(({ _id, name, image, description }) => (
                    <div className="place-item" key={_id}>
                        <Link to={`/places/${_id}`}>
                            <h3>{name}</h3>
                        </Link>
                        <img src={image} alt={name} className="place-image" />
                        <p>{description}</p>
                        <Link to={`/places/${_id}/edit`}>
                            <button className="edit-button">Edit Place</button>
                        </Link>
                    </div>
                ))
            )}
            {/* Always show the button to add a new place for the user */}
            <Link to="/places/new">
                <button className="add-button">Add New Place</button>
            </Link>
        </div>
    );
};

export default PlaceList;
