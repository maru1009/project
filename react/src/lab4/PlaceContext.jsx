// src/lab4/PlaceContext.jsx
import React, { createContext, useContext, useState } from 'react';

const PlaceContext = createContext();

export const PlaceProvider = ({ children }) => {
    const [places, setPlaces] = useState([]); // To hold places

    const addPlace = async (newPlace) => {
        try {
            const response = await fetch('http://localhost:5000/api/places', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPlace),
            });

            if (!response.ok) {
                throw new Error('Failed to add place');
            }
            const addedPlace = await response.json();
            setPlaces((prevPlaces) => [...prevPlaces, addedPlace]); // Update local state with the new place
        } catch (error) {
            console.error('Error adding place:', error);
        }
    };

    const updatePlace = async (pid, updatedPlace) => {
        try {
            const response = await fetch(`http://localhost:5000/api/places/${pid}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPlace),
            });

            if (!response.ok) {
                throw new Error('Failed to update place');
            }
            const updated = await response.json();
            setPlaces((prevPlaces) =>
                prevPlaces.map((place) => (place._id === pid ? updated : place))
            ); // Update local state with the updated place
        } catch (error) {
            console.error('Error updating place:', error);
        }
    };

    return (
        <PlaceContext.Provider value={{ places, addPlace, updatePlace }}>
            {children}
        </PlaceContext.Provider>
    );
};

export const usePlaces = () => {
    return useContext(PlaceContext);
};
