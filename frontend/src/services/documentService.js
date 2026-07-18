// Path: src/services/documentService.ts
import api from './api';

export const documentService = {
    // Upload a PDF for processing
    uploadPDF: async (file, conversationId = null) => {
        const formData = new FormData();
        formData.append('paper', file); 
        formData.append('title', file.name); // Send basic required metadata
        
        if (conversationId) {
            formData.append('conversationId', conversationId);
        }

        const response = await api.post('/papers/upload', formData, {
            headers: {
                // Override default JSON content type for file uploads
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Fetch all documents for the sidebar
    getDocuments: async () => {
        const response = await api.get('/papers');
        // map backend 'papers' to frontend expectations if necessary
        return response.data.papers || response.data;
    },

    // Get analytics (Predicted topics, stats)
    getAnalytics: async () => {
        const response = await api.get('/analytics/topics');
        return response.data;
    },

    // Send a message to the AI Chat
    sendChatMessage: async (payload) => {
        const response = await api.post('/chat', payload);
        return response.data;
    },

    // Generate a quiz from a specific topic or document
    generateQuiz: async (topicId) => {
        const response = await api.post('/quiz/generate', { topicId });
        return response.data;
    }
};