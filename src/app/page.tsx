'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, TrendingUp, Wallet, PiggyBank } from 'lucide-react'
import { AssetSummary } from '@/features/dashboard/ui/AssetSummary'
import { TransactionList } from '@/features/dashboard/ui/TransactionList'
import { RecommendationCard } from '@/features/dashboard/ui/RecommendationCard'
import { useAppStore } from '@/shared/store/useAppStore'
import Link from 'next/link'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export default function Home() {
  const user = useAppStore((state) => state.user)

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={item} className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            안녕하세요, <span className="text-primary">{user?.name || '사용자'}</span>님!
          </h1>
          <p className="text-muted-foreground mt-2">오늘의 금융 현황을 확인해보세요.</p>
        </div>
        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm font-medium transition-colors border border-white/10">
          {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </button>
      </motion.div>

      <motion.div variants={item}>
        <RecommendationCard />
      </motion.div>

      <motion.div variants={item}>
        <AssetSummary />
      </motion.div>

      <motion.div variants={item} className="grid gap-6 md:grid-cols-2">
        <div className="p-6 rounded-2xl bg-card border border-border min-h-[300px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">최근 거래 내역</h3>
            <Link href="/transactions" className="text-sm text-primary hover:underline">모두 보기</Link>
          </div>
          <TransactionList />
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border min-h-[300px] flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse relative z-10">
            <TrendingUp size={32} />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-semibold">AI 금융 인사이트</h3>
            <p className="text-muted-foreground max-w-xs mx-auto mt-2">
              이번 달 커피 지출이 15% 증가했습니다. 예산을 설정해보시는 건 어떨까요?
            </p>
          </div>
          <Link href="/chat">
            <button className="relative z-10 px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/25">
              Tickle에게 물어보기
            </button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}
