// src/login.js
import React, { useState } from 'react';
import { useAuth } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const isSuccess = await login(username, password);
    
        if (isSuccess) {
            navigate('/');
        } else {
            setError('Хэрэглэгчийн нэр эсвэл нууц үг буруу байна.');
    
            // Remove error message after 10 seconds
            setTimeout(() => {
                setError('');
            }, 5000); // 10,000 milliseconds = 10 seconds
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Хэрэглэгчийн нэр:
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
                <button type="submit" className="login-button">Нэвтрэх</button>
            </form>
        </div>
    );
};

export default Login;
