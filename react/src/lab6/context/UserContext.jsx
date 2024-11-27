import React, { createContext, useContext, useState, useEffect } from 'react';

// Define context
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [users, setUsers] = useState([]);
    const [places, setPlaces] = useState({});

    // Check login state on component mount
    useEffect(() => {
        const checkLoginState = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/users/validate-session', {
                    method: 'GET',
                    credentials: 'include', // Ensure credentials are sent with the request (session cookie)
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setIsLoggedIn(true);
                    setUsername(data.username);
                } else {
                    setIsLoggedIn(false);
                    setUsername('');
                }
            } catch (error) {
                console.error('Session баталгажуулахад алдаа гарлаа:', error);
            }
        };
    
        checkLoginState();
    }, []);

    // Fetch users from server
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/users');
                const data = await response.json();
                setUsers(data.users);
                fetchAllPlaces(data.users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers(); // Fetch users only if logged in
    }, [isLoggedIn]);

    // Fetch all places for all users
    const fetchAllPlaces = async (users) => {
        try {
            const allPlaces = {};
            for (const user of users) {
                const response = await fetch(`http://localhost:3000/api/places/user/${user._id}`);
                if (response.ok) {
                    const data = await response.json();
                    allPlaces[user.name] = data.places; // Use user name as the key
                } else {
                    console.error(`Error fetching places for ${user.name}:`, await response.json());
                }
            }
            setPlaces(allPlaces);
        } catch (error) {
            console.error('Error fetching all places:', error);
        }
    };

    const login = async (userInput, password) => {
        try {
            const response = await fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: userInput, password }),
                credentials: 'include', // Include cookies for token handling
            });

            if (response.ok) {
                const data = await response.json();
                setIsLoggedIn(true);
                setUsername(data.user.name);
                return true;
            } else {
                const error = await response.json();
                console.error('Login failed:', error.message || 'Unexpected error');
                return false;
            }
        } catch (error) {
            console.error('Error during login:', error);
            return false;
        }
    };

    const logout = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users/logout', {
                method: 'POST',
                credentials: 'include', // Ensure cookies are sent for logout
            });

            if (response.ok) {
                setIsLoggedIn(false);
                setUsername('');
            } else {
                console.error('Error during logout:', await response.json());
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const register = async (newUsername, newPassword) => {
        try {
            const response = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newUsername, password: newPassword }),
            });

            if (response.ok) {
                const newUser = await response.json();
                setUsers([...users, newUser]);
                setPlaces(prevPlaces => ({ ...prevPlaces, [newUsername]: [] }));
                return true;
            } else {
                const error = await response.json();
                console.error('Registration failed:', error.message || 'Unexpected error');
                return false;
            }
        } catch (error) {
            console.error('Error during registration:', error);
            return false;
        }
    };

    const addPlace = async (username, newPlace) => {
        try {
            const response = await fetch(`http://localhost:3000/api/places/${username}/places`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPlace),
            });

            if (response.ok) {
                const place = await response.json();
                setPlaces(prevPlaces => ({
                    ...prevPlaces,
                    [username]: [...(prevPlaces[username] || []), place],
                }));
            } else {
                console.error('Error adding place:', await response.json());
            }
        } catch (error) {
            console.error('Error adding place:', error);
        }
    };

    const updatePlace = async (username, updatedPlace) => {
        try {
            const response = await fetch(`http://localhost:3000/api/places/${username}/places/${updatedPlace._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPlace),
            });

            if (response.ok) {
                // After updating the place, refetch the user's places
                fetchAllPlaces(users);
            } else {
                console.error('Error updating place:', await response.json());
            }
        } catch (error) {
            console.error('Error during update:', error);
        }
    };

    const removePlace = async (username, placeId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/places/${username}/places/${placeId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setPlaces(prevPlaces => ({
                    ...prevPlaces,
                    [username]: prevPlaces[username].filter(place => place._id !== placeId),
                }));
            } else {
                console.error('Error removing place:', await response.json());
            }
        } catch (error) {
            console.error('Error removing place:', error);
        }
    };

    return (
        <UserContext.Provider value={{
            isLoggedIn,
            username,
            users,
            login,
            logout,
            register,
            places,
            addPlace,
            updatePlace,
            removePlace
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useAuth = () => useContext(UserContext);
