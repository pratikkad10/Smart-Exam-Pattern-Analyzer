import api from './api';

export const analyticsService = {
    getQuestionBank: async (paperIds = [], conversationId = null) => {
        let url = '/analytics/question-bank?';
        if (paperIds && paperIds.length > 0) {
            url += `paperIds=${paperIds.join(',')}&`;
        }
        if (conversationId) {
            url += `conversationId=${conversationId}&`;
        }
        const response = await api.get(url);
        return response.data;
    }
};
