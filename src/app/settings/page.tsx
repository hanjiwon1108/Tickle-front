'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Moon, Shield, User, ChevronRight, LogOut, ToggleLeft, ToggleRight } from 'lucide-react'
import { useAppStore } from '@/shared/store/useAppStore'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const user = useAppStore((state) => state.user)
  const logout = useAppStore((state) => state.logout)
  const router = useRouter()
  
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    const savedNotif = localStorage.getItem('settings_notifications')
    const savedTheme = localStorage.getItem('settings_theme')
    if (savedNotif !== null) setNotifications(savedNotif === 'true')
    if (savedTheme !== null) setDarkMode(savedTheme === 'dark')
  }, [])

  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showSecurityModal, setShowSecurityModal] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  const showToast = (msg: string) => {
    setToastMessage(msg)
  }

  const toggleNotifications = () => {
    const newValue = !notifications
    setNotifications(newValue)
    localStorage.setItem('settings_notifications', String(newValue))
    showToast(newValue ? '알림이 켜졌습니다' : '알림이 꺼졌습니다')
  }

  const toggleTheme = () => {
    const newValue = !darkMode
    setDarkMode(newValue)
    localStorage.setItem('settings_theme', newValue ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newValue)
    showToast(newValue ? '다크 모드가 적용되었습니다' : '라이트 모드가 적용되었습니다')
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setShowProfileModal(false)
    showToast('프로필이 업데이트되었습니다')
  }

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSecurityModal(false)
    showToast('비밀번호가 변경되었습니다')
  }

  interface SettingItem {
    icon: any
    label: string
    desc: string
    action?: () => void
    value?: boolean | string
    isToggle?: boolean
  }

  const sections: { title: string; items: SettingItem[] }[] = [
    {
      title: '계정 설정',
      items: [
        { icon: User, label: '프로필 수정', desc: '개인정보 및 프로필 사진 변경', action: () => setShowProfileModal(true) },
        { icon: Shield, label: '보안 및 로그인', desc: '비밀번호 변경 및 2단계 인증', action: () => setShowSecurityModal(true) },
      ]
    },
    {
      title: '앱 설정',
      items: [
        { 
          icon: Bell, 
          label: '알림 설정', 
          desc: '푸시 알림 및 이메일 수신 설정', 
          value: notifications,
          action: toggleNotifications,
          isToggle: true
        },
        { 
          icon: Moon, 
          label: '화면 테마', 
          desc: '다크 모드 설정', 
          value: darkMode,
          action: toggleTheme,
          isToggle: true
        },
      ]
    }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-24 left-1/2 z-50 px-6 py-3 bg-primary text-white rounded-full shadow-lg font-medium whitespace-nowrap"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfileModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
              exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
              className="fixed top-1/2 left-1/2 z-50 w-full max-w-md bg-card border border-border p-6 rounded-2xl shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-4">프로필 수정</h2>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">이름</label>
                  <input type="text" defaultValue={user?.name} className="w-full p-2 rounded-lg bg-muted border border-border" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">이메일</label>
                  <input type="email" defaultValue={user?.email} className="w-full p-2 rounded-lg bg-muted border border-border" />
                </div>
                <div className="flex gap-2 pt-4">
                  <button type="button" onClick={() => setShowProfileModal(false)} className="flex-1 py-2 rounded-xl hover:bg-muted transition-colors">취소</button>
                  <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors">저장</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Security Modal */}
      <AnimatePresence>
        {showSecurityModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSecurityModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
              exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
              className="fixed top-1/2 left-1/2 z-50 w-full max-w-md bg-card border border-border p-6 rounded-2xl shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-4">보안 설정</h2>
              <form onSubmit={handleSaveSecurity} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">현재 비밀번호</label>
                  <input type="password" placeholder="••••••••" className="w-full p-2 rounded-lg bg-muted border border-border" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">새 비밀번호</label>
                  <input type="password" placeholder="••••••••" className="w-full p-2 rounded-lg bg-muted border border-border" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">새 비밀번호 확인</label>
                  <input type="password" placeholder="••••••••" className="w-full p-2 rounded-lg bg-muted border border-border" />
                </div>
                <div className="flex gap-2 pt-4">
                  <button type="button" onClick={() => setShowSecurityModal(false)} className="flex-1 py-2 rounded-xl hover:bg-muted transition-colors">취소</button>
                  <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors">변경</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold">설정</h1>
        <p className="text-muted-foreground">앱 환경설정 및 계정을 관리하세요.</p>
      </motion.div>

      <div className="grid gap-6">
        {sections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold px-1">{section.title}</h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {section.items.map((item, i) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-0 text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {item.isToggle ? (
                      <div className={`transition-colors ${item.value ? 'text-primary' : 'text-muted-foreground'}`}>
                        {item.value ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                      </div>
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-4"
        >
          <button
            onClick={handleLogout}
            className="w-full p-4 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <LogOut size={20} />
            로그아웃
          </button>
        </motion.div>
      </div>
    </div>
  )
}
