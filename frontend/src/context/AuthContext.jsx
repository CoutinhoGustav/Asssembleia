import React, { createContext, useState, useEffect } from 'react';
import { config } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const token = localStorage.getItem(config.tokenKey);
            const storedUser = localStorage.getItem(config.userKey);
            if (token && storedUser && storedUser !== 'undefined') {
                const parsed = JSON.parse(storedUser);
                console.log('Auth state loaded:', parsed);
                setUser(parsed);
            } else {
                console.log('No auth state found in storage');
            }
        } catch (error) {
            console.error('Error loading auth state:', error);
            localStorage.removeItem(config.tokenKey);
            localStorage.removeItem(config.userKey);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await fetch(`${config.apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'bypass-tunnel-reminder': 'true'
            },
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
        const res = await fetch(`${config.apiUrl}/auth/register`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'bypass-tunnel-reminder': 'true'
            },
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
        localStorage.setItem(config.userKey, JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    const logout = () => {
        localStorage.removeItem(config.tokenKey);
        localStorage.removeItem(config.userKey);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
