// src/lab4/PlaceList.jsx
import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './UserContext';
import './PlaceList.css'

const PlaceList = () => {
    const { uid } = useParams();
    const { places, username, removePlace } = useAuth();
    const navigate = useNavigate(); // Use useNavigate for programmatic navigation
    const userPlaces = places[uid] || [];

    const handleRemovePlace = (placeId) => {
        removePlace(uid, placeId); // Call removePlace function to remove the place
    };

    return (
        <div className="place-list-container">
            <button className="back-button" onClick={() => navigate('/')}>Нүүр хуудас руу буцах</button>
            <h2>{uid}'s Places</h2>
            {userPlaces.length === 0 ? (
                <p>Газар байхгүй байна.</p>
            ) : (
                userPlaces.map(place => (
                    <div className="place-item" key={place._id}>
                        <Link to={`/places/${place._id}`}>
                            <h3>{place.name}</h3>
                        </Link>
                        <img src={place.image} alt={place.name} className="place-image" />
                        <p>{place.description}</p>
                        {uid === username && (
                            <>
                                <Link to={`/places/${place._id}/edit`}>
                                    <button className="edit-button">Edit Place</button>
                                </Link>
                                <button className="remove-button" onClick={() => handleRemovePlace(place._id)}>Remove Place</button>
                            </>
                        )}
                    </div>
                ))
            )}
            {/* Only show the Add New Place button for the logged-in user */}
            {uid === username && (
                <Link to="/places/new">
                    <button className="add-button">Газар нэмэх</button>
                </Link>
            )}
        </div>
    );
};

export default PlaceList;