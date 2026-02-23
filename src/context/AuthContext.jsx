import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Carrega usuário do localStorage quando o app inicia
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // LOGIN com integração à API
    const login = async (email, password) => {
        try {
            setError(null);
            const response = await authService.login(email, password);
            
            if (response.user) {
                setUser(response.user);
                return true;
            }
            return false;
        } catch (err) {
            // Fallback para mock caso API falhe
            if (email === 'admin@ibrc.com.br' && password === '123456') {
                const loggedUser = {
                    name: 'Admin IBRC',
                    email: 'admin@ibrc.com.br',
                    avatar: 'https://ui-avatars.com/api/?name=Admin+IBRC'
                };
                localStorage.setItem('auth', 'true');
                localStorage.setItem('user', JSON.stringify(loggedUser));
                setUser(loggedUser);
                return true;
            }
            setError(err.message);
            return false;
        }
    };

    // LOGOUT sem confirmação
    const logout = () => {
        authService.logout();
        setUser(null);
        setError(null);
    };

    // Atualiza usuário (Config page)
    const updateUser = async (newData) => {
        try {
            setError(null);
            const updated = await authService.updateProfile(newData);
            setUser(prev => ({
                ...prev,
                ...updated
            }));
        } catch (err) {
            // Fallback local caso API falhe
            setUser(prev => {
                const updated = { ...prev, ...newData };
                localStorage.setItem('user', JSON.stringify(updated));
                return updated;
            });
            setError(err.message);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                updateUser,
                loading,
                error
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Hook para acessar o auth
export const useAuth = () => useContext(AuthContext);
