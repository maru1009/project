// src/lab4/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './UserContext';
import { PlaceProvider } from './PlaceContext'; // Import PlaceProvider
import Home from './Home';
import Login from './Login';
import Register from './Register';
import PlaceList from './PlaceList';
import EditPlace from './EditPlace'; 
import PlaceDetail from './PlaceDetail';

const App = () => {
    return (
        <UserProvider>
            <PlaceProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/places/new" element={<EditPlace />} /> 
                        <Route path="/places/:pid" element={<PlaceDetail />} />
                        <Route path="/places/:pid/edit" element={<EditPlace />} />
                        <Route path="/:uid/places" element={<PlaceList />} /> 
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Router>
            </PlaceProvider>
        </UserProvider>
    );
};

export default App;
