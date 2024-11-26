// src/lab4/Home.jsx
import React from 'react';
import { useAuth } from './context/UserContext';
import { Link } from 'react-router-dom';
import './styles/Home.css'

const Home = () => {
    const { isLoggedIn, logout, username, users } = useAuth();

    return (
        <div className="home-container">
            <h1 className="welcome-title">Нүүр хуудас </h1>
            <div className="user-info">
                {!isLoggedIn ? (
                    <p className="edit-places">Та нэвтрээгүй байна.</p>
                ) : (
                    <p className="logged-in-message">Сайн байна уу <strong>{username}</strong>.</p>
                )}
            </div>

            <h2 className="users-title">Хэрэглэгчид</h2>
            <ul className="user-list">
                {users.map(user => (
                    <li key={user.name}>
                        <Link to={`/${user.name}/places`} className="user-link">{user.name}</Link>
                    </li>
                ))}
            </ul>

            <div className="auth-buttons">
                {!isLoggedIn ? (
                    <>
                        <Link to="/login">
                            <button className="btn">Нэвтрэх</button>
                        </Link>
                        <Link to="/register">
                            <button className="btn">Бүртгүүлэх</button>
                        </Link>
                    </>
                ) : (
                    <button className="btn logout-btn" onClick={logout}>Гарах</button>
                )}
            </div>
        </div>
    );
};

export default Home;