import { api } from "@/entities/user/api/auth";

export interface SpendingByCategory {
  category: string;
  amount: number;
  quantity: number;
}

export interface MonthlySummary {
  total_balance: number;
  monthly_savings: number;
  investment_return: number;
}

export const analysisApi = {
  getSpendingByCategory: async () => {
    const response = await api.get<SpendingByCategory[]>(
      "/analysis/spending-by-category"
    );
    return response.data;
  },
  getMonthlySummary: async () => {
    const response = await api.get<MonthlySummary>("/analysis/monthly-summary");
    return response.data;
  },
};
