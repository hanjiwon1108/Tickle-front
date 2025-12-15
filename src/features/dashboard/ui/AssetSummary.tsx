import { useQuery } from '@tanstack/react-query'
import { assetApi } from '@/entities/asset/api/asset'
import { Wallet, PiggyBank, TrendingUp, ArrowUpRight, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export function AssetSummary() {
  const { data: assets, isLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: assetApi.getAll,
  })

  if (isLoading) {
    return <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
  }

  const totalBalance = assets?.reduce((sum, asset) => sum + asset.balance, 0) || 0
  
  // Mocking other stats for now as we don't have historical data
  const stats = [
    { title: '총 자산', value: `₩${totalBalance.toLocaleString()}`, change: '+2.5%', icon: Wallet, color: 'text-primary' },
    { title: '이번 달 저축', value: '₩850,000', change: '+12%', icon: PiggyBank, color: 'text-green-500' },
    { title: '투자 수익률', value: '+15.2%', change: '+4.1%', icon: TrendingUp, color: 'text-blue-500' },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat, i) => (
        <motion.div 
          key={i} 
          whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(255, 95, 0, 0.3)' }}
          className="p-6 rounded-2xl bg-card border border-border transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-muted group-hover:bg-primary/10 transition-colors ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <span className="flex items-center text-sm font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
              {stat.change} <ArrowUpRight size={14} className="ml-1" />
            </span>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
          <p className="text-2xl font-bold mt-1">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  )
}
