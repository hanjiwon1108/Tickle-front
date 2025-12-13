import { SpendingChart } from '@/features/analysis/ui/SpendingChart'
import { ProductList } from '@/features/analysis/ui/ProductList'
import { InvestmentSimulator } from '@/features/analysis/ui/InvestmentSimulator'
import { MonthlyTrendChart } from '@/features/analysis/ui/MonthlyTrendChart'

export default function AnalysisPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">금융 분석</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 rounded-2xl bg-card border border-border">
          <h3 className="text-lg font-semibold mb-4">카테고리별 지출</h3>
          <SpendingChart />
        </div>
        
        <div className="p-6 rounded-2xl bg-card border border-border">
          <h3 className="text-lg font-semibold mb-4">월별 추세</h3>
          <MonthlyTrendChart />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <h3 className="text-xl font-bold">추천 상품</h3>
          <ProductList />
        </div>
        
        <div className="space-y-6">
          <h3 className="text-xl font-bold">투자 시뮬레이션</h3>
          <InvestmentSimulator />
        </div>
      </div>
    </div>
  )
}
