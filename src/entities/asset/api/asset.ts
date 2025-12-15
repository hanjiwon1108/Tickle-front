import { api } from '@/entities/user/api/auth';

export interface Asset {
  id: number;
  type: string;
  name: string;
  balance: number;
  currency: string;
}

export const assetApi = {
  getAll: async () => {
    const response = await api.get<Asset[]>('/assets/');
    return response.data;
  },
  create: async (asset: Omit<Asset, 'id'>) => {
    const response = await api.post<Asset>('/assets/', asset);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/assets/${id}`);
  },
};
