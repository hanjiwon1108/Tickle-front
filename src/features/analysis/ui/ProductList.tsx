'use client'

import { useQuery } from '@tanstack/react-query'
import { publicDataApi } from '@/entities/public-data/api/public-data'
import { PiggyBank, TrendingUp, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export function ProductList() {
  const { data: savings, isLoading } = useQuery({
    queryKey: ['saving-products'],
    queryFn: publicDataApi.getSavingProducts,
  })

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
  }

  const products = savings?.result.baseList.slice(0, 3).map((base, i) => {
    const option = savings.result.optionList.find(opt => opt.fin_prdt_nm === base.fin_prdt_nm)
    return {
      id: i,
      name: base.fin_prdt_nm,
      provider: base.kor_co_nm,
      rate: option ? `연 ${option.intr_rate2}%` : '변동',
      type: '적금',
      icon: PiggyBank,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10'
    }
  }) || []

  return (
    <div className="space-y-4">
      {products.map((product, i) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${product.bg} ${product.color}`}>
              <product.icon size={24} />
            </div>
            <div>
              <h4 className="font-semibold">{product.name}</h4>
              <p className="text-sm text-muted-foreground">{product.provider} • {product.type}</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className={`font-bold text-lg ${product.color}`}>{product.rate}</p>
            <button className="text-xs font-medium text-muted-foreground group-hover:text-primary flex items-center justify-end gap-1 transition-colors">
              가입하기 <ArrowRight size={12} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
