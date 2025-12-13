import { api } from '@/entities/user/api/auth';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const chatApi = {
  sendMessage: async (message: string) => {
    const response = await api.post<{ response: string }>('/chat/', { message });
    return response.data;
  },
};
