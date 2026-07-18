import api from './api';

export const chatService = {
    askQuestion: async (query, paperId = null, conversationId = null) => {
        const payload = { query };
        if (paperId) payload.paperId = paperId;
        if (conversationId) payload.conversationId = conversationId;
        
        const response = await api.post('/chat', payload);
        return response.data;
    },
    
    getConversations: async () => {
        const response = await api.get('/chat/conversations');
        return response.data;
    },

    createConversation: async () => {
        const response = await api.post('/chat/conversations');
        return response.data;
    },
    
    getConversationHistory: async (conversationId) => {
        const response = await api.get(`/chat/conversations/${conversationId}`);
        return response.data;
    },

    deleteConversation: async (conversationId) => {
        const response = await api.delete(`/chat/conversations/${conversationId}`);
        return response.data;
    }
};
