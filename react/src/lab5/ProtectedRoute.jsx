// src/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/UserContext';

const ProtectedRoute = ({ element }) => {
    const { username } = useAuth(); // Get username from context to check if the user is logged in
    
    if (!username) {
        // Redirect to login page if the user is not logged in
        return <Navigate to="/login" />;
    }

    return element; // Render the protected element if logged in
};

export default ProtectedRoute;
