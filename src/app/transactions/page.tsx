'use client'

import { useQuery } from '@tanstack/react-query'
import { transactionApi } from '@/entities/transaction/api/transaction'
import { Loader2, Coffee, ShoppingBag, Zap, CreditCard, Utensils, Car, Home, Smartphone, PiggyBank, ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const getIcon = (category: string) => {
  switch (category) {
    case '카페': return Coffee
    case '쇼핑': return ShoppingBag
    case '배달음식': return Utensils
    case '택시비': return Car
    case '주거비': return Home
    case '구독': return Smartphone
    case '저축': return PiggyBank
    case '수입': return TrendingUp
    default: return CreditCard
  }
}

const getColor = (category: string) => {
  switch (category) {
    case '카페': return 'text-amber-500 bg-amber-500/10'
    case '쇼핑': return 'text-pink-500 bg-pink-500/10'
    case '배달음식': return 'text-orange-500 bg-orange-500/10'
    case '택시비': return 'text-blue-500 bg-blue-500/10'
    case '주거비': return 'text-purple-500 bg-purple-500/10'
    case '구독': return 'text-cyan-500 bg-cyan-500/10'
    case '저축': return 'text-green-500 bg-green-500/10'
    case '수입': return 'text-emerald-500 bg-emerald-500/10'
    default: return 'text-gray-500 bg-gray-500/10'
  }
}

export default function TransactionsPage() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: transactionApi.getAll,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    )
  }

  const totalIncome = transactions?.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0) || 0
  const totalExpense = transactions?.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <button className="p-2 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">거래 내역</h1>
          <p className="text-muted-foreground">모든 거래 기록을 확인하세요</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <TrendingUp size={20} />
            </div>
            <span className="text-muted-foreground">총 수입</span>
          </div>
          <p className="text-2xl font-bold text-emerald-500">+₩{totalIncome.toLocaleString()}</p>
        </div>
        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
              <TrendingDown size={20} />
            </div>
            <span className="text-muted-foreground">총 지출</span>
          </div>
          <p className="text-2xl font-bold text-red-500">-₩{totalExpense.toLocaleString()}</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4">전체 거래 ({transactions?.length || 0}건)</h3>
        
        {!transactions?.length ? (
          <div className="p-8 text-center text-muted-foreground">
            거래 내역이 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((t, i) => {
              const Icon = getIcon(t.category)
              const colorClass = getColor(t.category)
              const isIncome = t.amount > 0
              
              return (
                <motion.div 
                  key={t.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <p className="font-medium">{t.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {t.category}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(t.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`font-bold text-lg ${isIncome ? 'text-emerald-500' : 'text-red-500'}`}>
                    {isIncome ? '+' : ''}₩{Math.abs(t.amount).toLocaleString()}
                  </span>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
