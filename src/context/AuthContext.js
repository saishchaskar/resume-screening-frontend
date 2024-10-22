// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
export const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: localStorage.getItem('token') || null,
        user: null,
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.token) {
                try {
                    const response = await axios.get('http://localhost:5000/api/user', {
                        headers: { Authorization: `Bearer ${auth.token}` },
                    });
                    setAuth((prev) => ({ ...prev, user: response.data }));
                } catch (error) {
                    console.error("Failed to fetch user data", error);
                }
            }
        };
        fetchUserData();
    }, [auth.token]);

    const login = async (credentials) => {
        try {
            const response = await axios.post('http://localhost:5000/api/login', credentials);
            localStorage.setItem('token', response.data.token);
            setAuth({ token: response.data.token, user: response.data.user });
            return { success: true, token: response.data.token }; // Return token here
        } catch (error) {
            return { success: false, message: error.response?.data?.error || 'Login failed.' };
        }
    };

    const signup = async (userInfo) => {
        try {
            const response = await axios.post('http://localhost:5000/api/signup', userInfo);
            localStorage.setItem('token', response.data.token);
            setAuth({ token: response.data.token, user: response.data.user });
            return { success: true, token: response.data.token }; // Return token here
        } catch (error) {
            return { success: false, message: error.response?.data?.error || 'Signup failed.' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuth({ token: null, user: null });
    };

    return (
        <AuthContext.Provider value={{ auth, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
