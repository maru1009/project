// src/lab4/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Predefined users for demo purposes
const predefinedUsers = [
    { name: 'user1', password: 'pass1' },
    { name: 'user2', password: 'pass2' },
];

// Initial static places for the users
const predefinedPlaces = {
    user1: [
        { id: '1', name: 'Place A1', image: 'https://via.placeholder.com/150', description: 'User 1 zurag 1' },
        { id: '2', name: 'Place A2', image: 'https://via.placeholder.com/150', description: 'User 1 zurag 2 ' },
    ],
    user2: [
        { id: '3', name: 'Place B1', image: 'https://via.placeholder.com/150', description: 'User 2 zurag 1' },
        { id: '4', name: 'Place B2', image: 'https://via.placeholder.com/150', description: 'User 2 zurag 2' },
    ],
};

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [users, setUsers] = useState(predefinedUsers); // Initialize with predefined users
    const [places, setPlaces] = useState(predefinedPlaces); // Initialize with predefined places

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setIsLoggedIn(true);
            setUsername(storedUsername);
        }
    }, []);

    const login = (userInput, password) => {
        const user = users.find(user => user.name === userInput && user.password === password);
        if (user) {
            setIsLoggedIn(true);
            setUsername(userInput);
            localStorage.setItem('username', userInput);
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUsername('');
        localStorage.removeItem('username');
    };

    const register = (newUsername, newPassword) => {
        const userExists = users.some(user => user.name === newUsername);
        if (userExists) {
            return false;
        }
        const newUser = { name: newUsername, password: newPassword };
        setUsers([...users, newUser]); // Add new user to users array
        setPlaces({ ...places, [newUsername]: [] }); // Add new user with empty places
        return true;
    };

    const addPlace = (username, newPlace) => {
        setPlaces(prevPlaces => ({
            ...prevPlaces,
            [username]: [...(prevPlaces[username] || []), newPlace]
        }));
    };

    const removePlace = (username, placeId) => {
        setPlaces(prevPlaces => ({
            ...prevPlaces,
            [username]: prevPlaces[username].filter(place => place.id !== placeId)
        }));
    };

    return (
        <UserContext.Provider value={{ isLoggedIn, username, users, login, logout, register, places, addPlace, removePlace }}>
            {children}
        </UserContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(UserContext);
};