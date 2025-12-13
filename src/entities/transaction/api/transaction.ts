import { api } from '@/entities/user/api/auth';

export interface Transaction {
  id: number;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export const transactionApi = {
  getAll: async () => {
    const response = await api.get<Transaction[]>('/transactions/');
    return response.data;
  },
  create: async (transaction: Omit<Transaction, 'id'>) => {
    const response = await api.post<Transaction>('/transactions/', transaction);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/transactions/${id}`);
  },
};
