import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext';
import '../styles/PlaceList.css';

const PlaceList = () => {
    const { uid } = useParams();
    const { places, username, removePlace } = useAuth();
    const navigate = useNavigate(); // Use useNavigate for programmatic navigation

    // Validate places data, ensuring it's an object with a valid user
    const userPlaces = Array.isArray(places[uid]) ? places[uid] : [];

    // Validate the user ID from the URL and ensure it matches the username
    if (!uid || typeof uid !== 'string') {
        return <p>Error: Invalid user ID</p>;
    }

    const handleRemovePlace = (placeId) => {
        if (window.confirm('Are you sure you want to remove this place?')) {
            removePlace(uid, placeId); // Call removePlace function to remove the place
        }
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
                        {/* Validate the image URL before rendering */}
                        {place.image && place.image.startsWith('http') ? (
                            <img src={place.image} alt={place.name} className="place-image" />
                        ) : (
                            <img src="/default-image.jpg" alt="Default" className="place-image" />
                        )}
                        <p>{place.description}</p>
                        {uid === username && (
                            <>
                                <Link to={`/places/${place._id}/edit`}>
                                    <button className="edit-button">Газар засах</button>
                                </Link>
                                <button className="remove-button" onClick={() => handleRemovePlace(place._id)}>Газар устгах</button>
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
