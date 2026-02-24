import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            if (token && storedUser && storedUser !== 'undefined') {
                const parsed = JSON.parse(storedUser);
                console.log('Auth state loaded:', parsed);
                setUser(parsed);
            } else {
                console.log('No auth state found in storage');
            }
        } catch (error) {
            console.error('Error loading auth state:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3002';
        const res = await fetch(`${baseURL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (!res.ok) {
            throw { response: { data } };
        }

        if (data.token && (data.admin || data.user)) {
            const userData = data.admin || data.user;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return data;
        } else {
            throw { response: { data: { message: 'Dados de usuário ausentes' } } };
        }
    };

    const register = async (name, email, password) => {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3002';
        const res = await fetch(`${baseURL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();

        if (!res.ok) {
            throw { response: { data } };
        }

        if (data.token && (data.admin || data.user)) {
            const userData = data.admin || data.user;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return data;
        } else {
            throw { response: { data: { message: 'Erro ao registrar usuário' } } };
        }
    };

    const updateProfile = (newData) => {
        const updatedUser = { ...user, ...newData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
