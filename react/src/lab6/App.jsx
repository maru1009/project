// src/lab6/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Home from './Home';
import Login from './auth/Login';
import Register from './auth/Register';
import PlaceList from './places/PlaceList';
import EditPlace from './places/EditPlace'; // Used for both adding and editing
import PlaceDetail from './places/PlaceDetail';
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component

const App = () => {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protect these routes */}
                    <Route path="/places/new" element={<ProtectedRoute element={<EditPlace />} />} />
                    <Route path="/places/:pid/edit" element={<ProtectedRoute element={<EditPlace />} />} />

                    <Route path="/places/:pid" element={<PlaceDetail />} />
                    <Route path="/:uid/places" element={<PlaceList />} />
                    
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;
