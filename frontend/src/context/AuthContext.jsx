import React, { createContext, useState, useEffect } from 'react';
import api from '../api';
import { config } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    console.log('[Auth] Initializing AuthProvider component...');

    useEffect(() => {
        console.log('[Auth] Running initialization effect...');
        try {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            console.log('[Auth] Found token:', !!token, 'Found user:', !!storedUser);
            
            if (token && storedUser && storedUser !== 'undefined') {
                const parsed = JSON.parse(storedUser);
                console.log('[Auth] Auth state loaded:', parsed);
                setUser(parsed);
            } else {
                console.log('[Auth] No auth state found in storage');
            }
        } catch (error) {
            console.error('[Auth] Error loading auth state:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } finally {
            console.log('[Auth] Initialization finished, setting loading to false');
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            const data = res.data;

            if (data.token && (data.admin || data.user)) {
                const userData = data.admin || data.user;
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                return data;
            } else {
                throw { response: { data: { message: 'Dados de usuário ausentes' } } };
            }
        } catch (err) {
            console.error('Login error:', err);
            throw err;
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await api.post('/auth/register', { name, email, password });
            const data = res.data;

            if (data.token && (data.admin || data.user)) {
                const userData = data.admin || data.user;
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                return data;
            } else {
                throw { response: { data: { message: 'Erro ao registrar usuário' } } };
            }
        } catch (err) {
            console.error('Register error:', err);
            throw err;
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
