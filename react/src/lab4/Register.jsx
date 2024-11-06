// src/lab4/Register.jsx
import React, { useState } from 'react';
import { useAuth } from './UserContext';
import { useNavigate, Link } from 'react-router-dom';
import './register.css'

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const isSuccess = register(username, password);
        
        if (isSuccess) {
            navigate('/'); // Navigate to the home page on successful registration
        } else {
            setError('Хэрэглэгч үүссэн байна'); // Handle registration failure
        }
    };

    return (
        <div className="register-container">
            <h1>Register</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Нэр:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Нууц үг:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit" className="register-button">Бүртгүүлэх</button>
            </form>
            <Link to="/" className="back-link">Нүүр хуудас руу буцах</Link>
        </div>
    );
};

export default Register;