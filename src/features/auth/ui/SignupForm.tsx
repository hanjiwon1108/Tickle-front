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
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다'),
  email: z.string().email('유효한 이메일 주소를 입력해주세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
})

type FormData = z.infer<typeof schema>

export function SignupForm() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      // Assuming 'api' is an imported axios instance or similar.
      // The original code used authApi.signup, which is a specific function.
      // The new code implies a generic 'api.post'.
      // For this change, I'll assume `authApi` can be used as `api` for the post request.
      // If `api` is not defined, this would cause a runtime error.
      // To be faithful to the instruction, I'll use `authApi` as the base for the post call.
      // If `authApi` doesn't have a `.post` method, this would be an issue.
      // Given the original `authApi.signup` takes email, password, name,
      // I'll adapt the new instruction's structure to the existing `authApi`.
      await authApi.signup(data.email, data.password, data.name)
      alert('회원가입이 완료되었습니다! 로그인해주세요.')
      router.push('/login')
    } catch (error) {
      console.error('Signup failed:', error)
      alert('회원가입에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-2xl border border-border shadow-xl">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">회원가입</h1>
        <p className="text-muted-foreground">Tickle과 함께 자산 관리를 시작하세요</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">이름</label>
          <input
            {...register('name')}
            type="text"
            className="w-full px-4 py-2 bg-muted rounded-lg border border-border focus:ring-2 focus:ring-primary/50 outline-none transition-all"
            placeholder="홍길동"
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">이메일</label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-4 py-2 bg-muted rounded-lg border border-border focus:ring-2 focus:ring-primary/50 outline-none transition-all"
            placeholder="name@example.com"
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">비밀번호</label>
          <input
            {...register('password')}
            type="password"
            className="w-full px-4 py-2 bg-muted rounded-lg border border-border focus:ring-2 focus:ring-primary/50 outline-none transition-all"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">비밀번호 확인</label>
          <input
            id="confirmPassword"
            type="password"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {isSubmitting ? '가입 중...' : '회원가입'}
        </button>
      </form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}
