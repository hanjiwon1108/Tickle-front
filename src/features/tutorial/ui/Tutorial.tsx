'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'

const steps = [
  {
    title: '환영합니다! 👋',
    content: 'Tickle은 당신의 AI 자산관리 파트너입니다. 주요 기능을 빠르게 살펴볼까요?',
    target: 'body',
    position: 'center'
  },
  {
    title: '대시보드 📊',
    content: '현재 자산 현황과 최근 거래 내역을 한눈에 확인할 수 있습니다.',
    target: 'main',
    position: 'center'
  },
  {
    title: 'AI 상담 💬',
    content: '궁금한 금융 질문이 있다면 언제든 AI에게 물어보세요.',
    target: 'a[href="/chat"]',
    position: 'right'
  },
  {
    title: '분석 및 추천 📈',
    content: '소비 패턴을 분석하고 나에게 딱 맞는 금융 상품을 추천받으세요.',
    target: 'a[href="/analysis"]',
    position: 'right'
  }
]

export function Tutorial() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial')
    if (!hasSeenTutorial) {
      setIsOpen(true)
    }
  }, [])

  // Reset target rect when step changes to prevent jumping to stale position
  useEffect(() => {
    setTargetRect(null)
  }, [currentStep])

  const updateTargetRect = useCallback(() => {
    if (!isOpen) return
    
    const step = steps[currentStep]
    if (step.target === 'body') {
      setTargetRect(null)
      return
    }

    // Try to find target
    const el = document.querySelector(step.target)
    if (el) {
      // Scroll to element
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })

      // Poll for position updates to handle smooth scrolling
      const startTime = Date.now()
      const duration = 1000 // Track for 1 second
      
      const update = () => {
        if (!isOpen || currentStep !== steps.indexOf(step)) return

        const rect = el.getBoundingClientRect()
        
        // Check if element is visible/valid
        if (rect.width === 0 || rect.height === 0 || (rect.top < 0 && rect.bottom < 0)) {
          // Only set to null if we haven't found it yet or it disappeared
          // But if we are scrolling, it might be temporarily off? 
          // Actually if it's 0 size it's hidden.
          if (Date.now() - startTime > duration) {
             setTargetRect(null)
          }
        } else {
          // Add padding
          const padding = 8
          setTargetRect({
            ...rect,
            top: rect.top - padding,
            left: rect.left - padding,
            width: rect.width + (padding * 2),
            height: rect.height + (padding * 2),
            bottom: rect.bottom + padding,
            right: rect.right + padding,
            x: rect.x - padding,
            y: rect.y - padding,
            toJSON: () => {}
          })
        }

        if (Date.now() - startTime < duration) {
          requestAnimationFrame(update)
        }
      }

      requestAnimationFrame(update)
    } else {
      setTargetRect(null)
    }
  }, [currentStep, isOpen])

  useEffect(() => {
    // Initial update
    const timer = setTimeout(updateTargetRect, 100)
    
    window.addEventListener('resize', updateTargetRect)
    window.addEventListener('scroll', updateTargetRect)
    
    return () => {
      window.removeEventListener('resize', updateTargetRect)
      window.removeEventListener('scroll', updateTargetRect)
      clearTimeout(timer)
    }
  }, [updateTargetRect])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('hasSeenTutorial', 'true')
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleClose()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  useEffect(() => {
    (window as any).openTutorial = () => {
      setIsOpen(true)
      setCurrentStep(0)
    }
  }, [])

  if (!isOpen) return null

  const isSpotlight = targetRect !== null

  // Calculate tooltip position with strict clamping
  let tooltipStyle: any = {
    top: '50%',
    left: '50%',
    x: '-50%',
    y: '-50%',
  }

  if (isSpotlight && targetRect) {
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1000
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800
    const tooltipWidth = 320 // Approx width
    const tooltipHeight = 250 // Approx max height
    const padding = 16

    const step = steps[currentStep]
    const preferredPosition = step.position || 'bottom'

    // Helper to check if rect fits in viewport
    const checkFits = (t: number, l: number, w: number, h: number) => {
      return t >= padding && 
             l >= padding && 
             t + h <= viewportHeight - padding && 
             l + w <= viewportWidth - padding
    }

    // Initial calculation based on preference
    let top = 0
    let left = 0
    let x = '0'
    let y = '0'

    const calculatePosition = (pos: string) => {
      let t = 0, l = 0, tx = '0', ty = '0'
      
      switch (pos) {
        case 'top':
          t = targetRect.top - 20
          l = targetRect.left + (targetRect.width / 2)
          tx = '-50%'
          ty = '-100%'
          break
        case 'bottom':
          t = targetRect.bottom + 20
          l = targetRect.left + (targetRect.width / 2)
          tx = '-50%'
          ty = '0'
          break
        case 'left':
          t = targetRect.top + (targetRect.height / 2)
          l = targetRect.left - 20
          tx = '-100%'
          ty = '-50%'
          break
        case 'right':
          t = targetRect.top + (targetRect.height / 2)
          l = targetRect.right + 20
          tx = '0'
          ty = '-50%'
          break
        case 'center':
        default:
          t = targetRect.top + (targetRect.height / 2)
          l = targetRect.left + (targetRect.width / 2)
          tx = '-50%'
          ty = '-50%'
          break
      }
      return { top: t, left: l, x: tx, y: ty }
    }

    // Try preferred position
    let result = calculatePosition(preferredPosition)
    
    // If preferred is 'bottom' but doesn't fit, try 'top'
    // (Only if target is not 'center')
    if (preferredPosition !== 'center') {
      // Calculate visual bounds for checking
      // Note: This is a simplified check. 
      // For 'bottom': top is top, height is tooltipHeight.
      // For 'top': top is top - tooltipHeight.
      
      let visualTop = result.top
      if (result.y === '-100%') visualTop -= tooltipHeight
      if (result.y === '-50%') visualTop -= (tooltipHeight / 2)

      let visualLeft = result.left
      if (result.x === '-100%') visualLeft -= tooltipWidth
      if (result.x === '-50%') visualLeft -= (tooltipWidth / 2)

      const fits = checkFits(visualTop, visualLeft, tooltipWidth, tooltipHeight)

      if (!fits) {
        // Simple flip logic: if bottom fails, try top. If right fails, try left.
        let altPos = preferredPosition
        if (preferredPosition === 'bottom') altPos = 'top'
        if (preferredPosition === 'top') altPos = 'bottom'
        if (preferredPosition === 'right') altPos = 'left'
        if (preferredPosition === 'left') altPos = 'right'

        // If target is very large (like main), forcing 'top' might go offscreen too.
        // If targetRect height > viewportHeight * 0.8, maybe just center?
        if (targetRect.height > viewportHeight * 0.8 || targetRect.width > viewportWidth * 0.8) {
          altPos = 'center'
        }

        const altResult = calculatePosition(altPos)
        
        // Check if alt fits better? 
        // For now, just take alt if original didn't fit, unless alt is also bad?
        // Let's just use altResult, but clamp it later.
        result = altResult
      }
    }

    top = result.top
    left = result.left
    x = result.x
    y = result.y

    // Final Clamping to Viewport
    // We need to ensure the tooltip is within the screen bounds
    // Convert to absolute coordinates for clamping
    let absTop = top
    if (y === '-100%') absTop -= tooltipHeight
    if (y === '-50%') absTop -= (tooltipHeight / 2)

    let absLeft = left
    if (x === '-100%') absLeft -= tooltipWidth
    if (x === '-50%') absLeft -= (tooltipWidth / 2)

    // Clamp
    if (absTop < padding) {
      absTop = padding
      // Reconstruct 'top' based on 'y'
      if (y === '0') top = absTop
      if (y === '-100%') top = absTop + tooltipHeight
      if (y === '-50%') top = absTop + (tooltipHeight / 2)
    } else if (absTop + tooltipHeight > viewportHeight - padding) {
      absTop = viewportHeight - padding - tooltipHeight
      if (y === '0') top = absTop
      if (y === '-100%') top = absTop + tooltipHeight
      if (y === '-50%') top = absTop + (tooltipHeight / 2)
    }

    if (absLeft < padding) {
      absLeft = padding
      if (x === '0') left = absLeft
      if (x === '-100%') left = absLeft + tooltipWidth
      if (x === '-50%') left = absLeft + (tooltipWidth / 2)
    } else if (absLeft + tooltipWidth > viewportWidth - padding) {
      absLeft = viewportWidth - padding - tooltipWidth
      if (x === '0') left = absLeft
      if (x === '-100%') left = absLeft + tooltipWidth
      if (x === '-50%') left = absLeft + (tooltipWidth / 2)
    }

    tooltipStyle = {
      top,
      left,
      x,
      y,
      position: 'fixed'
    }
  }

  return (
    <AnimatePresence mode="wait">
      {/* Click Blocker */}
      <div key="click-blocker" className="fixed inset-0 z-[60] bg-transparent" />

      {/* Spotlight Overlay */}
      {isSpotlight ? (
        <motion.div
          key="spotlight-overlay"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
          }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed z-[61] rounded-xl pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]"
        />
      ) : (
        <motion.div
          key="dim-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[61] bg-black/70 backdrop-blur-sm"
        />
      )}

      {/* Tooltip / Modal */}
      <motion.div
        // Remove key to prevent unmount/remount flickering
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          ...tooltipStyle
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed z-[62] bg-card border border-border p-6 rounded-2xl shadow-2xl w-fit max-w-md mx-4"
        style={{
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: '80vh',
          overflowY: 'auto',
          // Ensure it doesn't go off screen horizontally if centered
          left: !isSpotlight ? '50%' : tooltipStyle.left,
          transform: !isSpotlight ? 'translate(-50%, -50%)' : `translate(${tooltipStyle.x}, ${tooltipStyle.y})`
        }}
      >
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X size={20} />
        </button>

        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Step {currentStep + 1} / {steps.length}
            </span>
            <h3 className="text-2xl font-bold">{steps[currentStep].title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {steps[currentStep].content}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div 
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${i === currentStep ? 'bg-primary' : 'bg-muted'}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              {currentStep === steps.length - 1 ? '시작하기' : '다음'}
              {currentStep < steps.length - 1 && <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
