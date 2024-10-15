// src/lab4/PlaceDetail.jsx
import React from 'react';
import { useAuth } from './UserContext';
import { useParams } from 'react-router-dom';
import './placeDetail.css';

const PlaceDetail = () => {
    const { places } = useAuth();
    const { pid } = useParams(); // Get the place ID from the URL
    const uid = Object.keys(places).find(user => 
        places[user].some(place => place.id === pid)
    ); // Find the user who owns the place
    const place = uid ? places[uid].find(place => place.id === pid) : null; // Find the specific place

    if (!place) {
        return <p>Place not found.</p>;
    }

    return (
        <div className="place-detail-container">
            <h1>{place.name}</h1>
            <img src={place.image} alt={place.name} className="place-image" />
            <p><strong>Description:</strong> {place.description}</p>
            <p><strong>Location:</strong> {place.location}</p> {/* Make sure you have a location property in your place object */}
        </div>
    );
};

export default PlaceDetail;
