import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const toast = useToast();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            setLoading(false);
            return;
        }
        try {
            const data = await authService.getCurrentUser();
            setUser(data.user);
        } catch (error) {
            console.error("Auth check failed:", error);
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (credentials) => {
        const data = await authService.login(credentials);
        setUser(data.user);
        return data;
    };

    const register = async (userData) => {
        const data = await authService.register(userData);
        setUser(data.user);
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        toast.info('Logged Out', 'You have been successfully logged out.');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}
