'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PieChart, MessageSquare, Settings, LogOut, Wallet, HelpCircle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { motion } from 'framer-motion'
import { useAppStore } from '@/shared/store/useAppStore'

const menuItems = [
  { icon: Home, label: '홈', href: '/' },
  { icon: PieChart, label: '분석', href: '/analysis' },
  { icon: MessageSquare, label: 'AI 상담', href: '/chat' },
  { icon: Settings, label: '설정', href: '/settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const logout = useAppStore((state) => state.logout)
  const user = useAppStore((state) => state.user)
  const isSidebarOpen = useAppStore((state) => state.isSidebarOpen)
  const toggleSidebar = useAppStore((state) => state.toggleSidebar)

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 h-screen w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out",
        "md:translate-x-0", // Always visible on desktop
        isSidebarOpen ? "translate-x-0" : "-translate-x-full" // Toggle on mobile
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <Wallet size={24} />
          </div>
          <span className="text-xl font-bold text-white">
            Tickle
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => isSidebarOpen && toggleSidebar()}>
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white"
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <button 
            onClick={() => (window as any).openTutorial?.()}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <HelpCircle size={20} />
            <span className="font-medium">도움말</span>
          </button>
          {user ? (
            <button 
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">로그아웃</span>
            </button>
          ) : (
            <Link 
              href="/login"
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-primary hover:bg-primary/10 transition-colors"
            >
              <LogOut size={20} className="rotate-180" />
              <span className="font-medium">로그인</span>
            </Link>
          )}
        </div>
      </aside>
    </>
  )
}
