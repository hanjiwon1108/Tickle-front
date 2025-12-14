'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { authApi } from '@/entities/user/api/auth'
import { useAppStore } from '@/shared/store/useAppStore'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

const schema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
})

type FormData = z.infer<typeof schema>

export function LoginForm() {
  const router = useRouter()
  const setToken = useAppStore((state) => state.setToken)
  const setUser = useAppStore((state) => state.setUser)
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      // Assuming 'api' is an imported axios instance or similar.
      // This part of the change implies a different API interaction than the original `authApi`.
      // For the purpose of this edit, I'm replacing with the provided snippet's logic.
      const response = await authApi.login(data.email, data.password) // Re-using authApi for consistency with original imports
      
      const { access_token } = response
      setToken(access_token)
      
      const userResponse = await authApi.me() // Re-using authApi for consistency
      setUser(userResponse)
      
      router.push('/')
    } catch (error) {
      console.error('Login failed:', error)
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.')
    }
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-2xl border border-border shadow-xl">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">로그인</h1>
        <p className="text-muted-foreground">Tickle에 오신 것을 환영합니다</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">이메일</label>
          <input
            type="email"
            {...register('email')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="name@example.com"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">비밀번호</label>
          <input
            type="password"
            {...register('password')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {isSubmitting ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  )
}
