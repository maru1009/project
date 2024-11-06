import React, { useState } from 'react';
import { useAuth } from './UserContext';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './Login.css'

const Login = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = (e) => {
        e.preventDefault();
        const isLoggedIn = login(username, password);
        if (!isLoggedIn) {
            setError('Invalid username or password'); // Set error message if login fails
        } else {
            setError(''); // Clear error message if login succeeds
            navigate('/'); // Redirect to the home page
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Нэр:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Нууц үг:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" className="btn">Нэвтрэх</button>
                {error && <p className="error-message">{error}</p>} {/* Display error message */}
            </form>
            <Link to="/" className="back-link">Нүүр хуудас руу буцах</Link>
        </div>
    );
};

export default Login;