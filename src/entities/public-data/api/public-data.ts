import { api } from '@/entities/user/api/auth'

export interface FinancialProduct {
  fin_co_no: string
  kor_co_nm: string
  fin_prdt_nm: string
  join_way: string
  mtrt_int: string
}

export interface ProductOption {
  fin_co_no: string
  fin_prdt_nm: string
  save_trm: string
  intr_rate: number
  intr_rate2: number
  intr_rate_type_nm: string
}

export interface ProductResponse {
  result: {
    err_cd: string
    err_msg: string
    baseList: FinancialProduct[]
    optionList: ProductOption[]
  }
}

export const publicDataApi = {
  getDepositProducts: async (): Promise<ProductResponse> => {
    const response = await api.get<ProductResponse>('/public-data/deposits')
    return response.data
  },

  getSavingProducts: async (): Promise<ProductResponse> => {
    const response = await api.get<ProductResponse>('/public-data/savings')
    return response.data
  }
}
