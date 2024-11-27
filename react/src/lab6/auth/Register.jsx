// src/register.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/register.css';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [validationError, setValidationError] = useState('');

    const validateInput = () => {
        if (username.length < 3) {
            return 'Хэрэглэгчийн нэр 3-н тэмдэгтээс дээш байх ёстой.';
        }
        if (!/^[a-zA-Z0-9]+$/.test(username)) {
            return 'Хэрэглэгчийн нэр зөвхөн тэмдэгт эсвэл тоо агуулах ёстой.';
        }
        if (password.length < 6) {
            return 'Хэрэглэгчийн нууц үг 6-н тэмдэгтээс дээш байх ёстой.';
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/ .test(password)) {
            return 'Хэрэглэгчийн нууц үг дор хаяж нэг том жижиг үсэг, тусгай тэмдэгт, тоо агуулсан байх ёстой.';
        }
        return '';
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationMessage = validateInput();
        if (validationMessage) {
            setValidationError(validationMessage);
            return;
        }

        setValidationError('');
        const isSuccess = register(username, password);

        if (isSuccess) {
            navigate('/');
        } else {
            setError('Бүртүүлэхэд алдаа гарлаа.');
        }
    };

    return (
        <div className="register-container">
            <h1>Register</h1>
            {error && <p className="error-message">{error}</p>}
            {validationError && <p className="error-message">{validationError}</p>}
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
                <button type="submit" className="register-button">Бүртгүүлэх</button>
            </form>
            <Link to="/" className="back-link">Нүүр хуудасруу буцах</Link>
        </div>
    );
};

export default Register;
