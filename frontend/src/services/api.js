// Path: src/services/api.ts
import axios from 'axios';

// Define the base URL for your Node.js backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Crucial for cookie-based authentication
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response Interceptor: Handle global errors (like expired tokens)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
            window.location.href = '/login'; // Force redirect to login
        }
        return Promise.reject(error);
    }
);

export default api;