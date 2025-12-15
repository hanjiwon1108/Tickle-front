'use client'

import { Lightbulb, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/shared/store/useAppStore'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export function RecommendationCard() {
  const user = useAppStore((state) => state.user)
  const [insight, setInsight] = useState({
    category: '커피',
    amount: '120,000',
    product: '카카오뱅크 26주 적금',
    rate: '4.5'
  })

  useEffect(() => {
    // Simulate personalization based on user
    if (user) {
      const insights = [
        { category: '택시비', amount: '85,000', product: '토스 굴비 적금', rate: '5.0' },
        { category: '배달음식', amount: '210,000', product: '신한 청년 적금', rate: '6.0' },
        { category: '쇼핑', amount: '150,000', product: '우리 WON 적금', rate: '4.2' },
      ]
      // Pick random insight for demo purposes (in real app, this comes from analysis API)
      const random = insights[Math.floor(Math.random() * insights.length)]
      setInsight(random)
    }
  }, [user])

  return (
    <div className="p-6 rounded-3xl bg-primary text-white shadow-xl shadow-orange-500/20 relative overflow-hidden group cursor-pointer border border-white/10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl transition-transform group-hover:scale-110 duration-700" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 shadow-inner">
            <Lightbulb className="w-6 h-6 text-white" fill="currentColor" />
          </div>
          <h3 className="text-lg font-bold tracking-tight">스마트 금융 인사이트</h3>
        </div>
        
        <div className="space-y-4 mb-8">
          <p className="text-orange-50 text-lg leading-relaxed font-medium">
            이번 달 <span className="text-white font-bold">{insight.category}</span> 지출을 줄이면 <br/>
            <span className="text-2xl font-extrabold text-white inline-block mt-1">{insight.amount}원</span>을 더 모을 수 있어요!
          </p>
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <p className="text-sm text-orange-100 mb-1">추천 상품</p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">{insight.product}</span>
              <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded text-sm">연 {insight.rate}%</span>
            </div>
          </div>
        </div>

        <Link href="/analysis" className="w-full">
          <button className="w-full flex items-center justify-center gap-2 text-sm font-bold bg-white text-[#FF5F00] hover:bg-orange-50 px-6 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95">
            추천 상품 보러가기 <ArrowRight size={18} />
          </button>
        </Link>
      </div>
    </div>
  )
}
