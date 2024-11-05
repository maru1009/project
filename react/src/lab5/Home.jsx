// src/lab4/Home.jsx
import React from 'react';
import { useAuth } from './UserContext';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const { isLoggedIn, logout, username, users } = useAuth();

    return (
        <div className="home-container">
            <h1 className="welcome-title">Home page</h1>
            <div className="user-info">
                {!isLoggedIn ? (
                    <p className="edit-places">Зураг үзэх сайт.</p>
                ) : (
                    <p className="logged-in-message">You are logged in as <strong>{username}</strong>.</p>
                )}
            </div>

            <h2 className="users-title">Хэрэглэгчид</h2>
            {users.length > 0 ? ( // Check if users exist
                <ul className="user-list">
                    {users.map((user, index) => (
                        <li key={index}>
                            <Link to={`/${user.username}/places`} className="user-link">{user.username}</Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No users found.</p> // Display this if no users exist
            )}

            <div className="auth-buttons">
                {!isLoggedIn ? (
                    <>
                        <Link to="/login">
                            <button className="btn">Login</button>
                        </Link>
                        <Link to="/register">
                            <button className="btn">Register</button>
                        </Link>
                    </>
                ) : (
                    <button className="btn logout-btn" onClick={logout}>Logout</button>
                )}
            </div>
        </div>
    );
};

export default Home;
