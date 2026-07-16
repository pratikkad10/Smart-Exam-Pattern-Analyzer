// Path: src/services/authService.ts
import api from './api';

export const authService = {
    // Login user
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        // Set isLoggedIn flag in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        return response.data;
    },

    // Register new user
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        localStorage.setItem('isLoggedIn', 'true');
        return response.data;
    },

    // Get logged-in user's profile
    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Logout functionality
    logout: async () => {
        try {
            await api.get('/auth/logout');
        } catch (error) {
            console.error("Logout failed on server:", error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
            window.location.href = '/login';
        }
    }
};