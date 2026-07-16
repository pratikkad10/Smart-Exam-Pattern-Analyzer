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
    },

    // Email Verification
    verifyEmail: async (token) => {
        const response = await api.get(`/auth/verify-email?token=${token}`);
        return response.data;
    },

    resendVerificationEmail: async (email) => {
        const response = await api.post('/auth/resend-verification-email', { email });
        return response.data;
    },

    // Password Recovery
    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    resetPassword: async (token, newPassword) => {
        const response = await api.post('/auth/reset-password', { token, newPassword });
        return response.data;
    },

    // User Settings Updates (Protected)
    updatePassword: async (passwordData) => {
        const response = await api.put('/auth/update-password', passwordData);
        return response.data;
    },

    updateEmail: async (emailData) => {
        const response = await api.put('/auth/update-email', emailData);
        return response.data;
    },

    updateProfile: async (profileData) => {
        const response = await api.put('/auth/profile', profileData);
        return response.data;
    },

    deleteAccount: async () => {
        const response = await api.delete('/auth/account');
        return response.data;
    }
};