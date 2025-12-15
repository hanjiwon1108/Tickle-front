'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, RefreshCw } from 'lucide-react'

export function InvestmentSimulator() {
  const [amount, setAmount] = useState(1000000)
  const [years, setYears] = useState(5)
  const [rate, setRate] = useState(5)

  const calculateReturn = () => {
    return Math.round(amount * Math.pow(1 + rate / 100, years))
  }

  const result = calculateReturn()
  const profit = result - amount

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white border border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="text-primary" />
        <h3 className="text-lg font-semibold">투자 시뮬레이터</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">초기 투자금 (원)</label>
          <input
            type="range"
            min="100000"
            max="100000000"
            step="100000"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="text-right font-mono font-bold text-xl">
            ₩{amount.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">기간 (년)</label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full bg-gray-700 border-none rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">수익률 (%)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full bg-gray-700 border-none rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-700">
          <div className="flex justify-between items-end mb-2">
            <span className="text-gray-400">예상 총액</span>
            <motion.span 
              key={result}
              initial={{ scale: 1.2, color: '#4ade80' }}
              animate={{ scale: 1, color: '#ffffff' }}
              className="text-2xl font-bold"
            >
              ₩{result.toLocaleString()}
            </motion.span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">총 수익</span>
            <span className="text-green-400">+₩{profit.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
