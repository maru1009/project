import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the UserContext
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [users, setUsers] = useState([]); // Initialize with an empty array
    const [places, setPlaces] = useState([]); // Initialize with an empty array

    useEffect(() => {
        // Load users from the API on initial mount
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/users');
                if (!response.ok) throw new Error('Failed to fetch users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUsers();

        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setIsLoggedIn(true);
            setUsername(storedUsername);
        }
    }, []);

    const login = async (userInput, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: userInput, password }),
            });
            if (!response.ok) throw new Error('Invalid username or password');
            const data = await response.json();
            setIsLoggedIn(true);
            setUsername(userInput);
            localStorage.setItem('username', userInput);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUsername('');
        localStorage.removeItem('username');
    };

    const register = async (newUsername, newPassword) => {
        try {
            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: newUsername, password: newPassword }),
            });

            if (!response.ok) throw new Error('Registration failed');

            const newUser = await response.json(); // Assuming the API returns the new user object
            setUsers(prev => [...prev, newUser]);
            setPlaces(prev => [...prev, { username: newUsername, places: [] }]); // Initialize places for new user
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const addPlace = async (username, newPlace) => {
        try {
            const response = await fetch(`http://localhost:5000/api/places/${username}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPlace),
            });

            if (!response.ok) throw new Error('Failed to add place');
            const addedPlace = await response.json();
            setPlaces(prev => {
                const userPlaces = prev.find(user => user.username === username);
                if (userPlaces) {
                    return prev.map(user => 
                        user.username === username
                            ? { ...user, places: [...user.places, addedPlace] }
                            : user
                    );
                }
                return prev;
            });
        } catch (error) {
            console.error('Error adding place:', error);
        }
    };

    const removePlace = async (username, placeId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/places/${username}/${placeId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to remove place');
            setPlaces(prev => {
                const userPlaces = prev.find(user => user.username === username);
                if (userPlaces) {
                    return prev.map(user => 
                        user.username === username
                            ? { ...user, places: user.places.filter(place => place.id !== placeId) }
                            : user
                    );
                }
                return prev;
            });
        } catch (error) {
            console.error('Error removing place:', error);
        }
    };

    return (
        <UserContext.Provider value={{ isLoggedIn, username, users, login, logout, register, places, addPlace, removePlace }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useAuth = () => {
    return useContext(UserContext);
};
