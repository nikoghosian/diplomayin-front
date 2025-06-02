'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'

import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'

import { IAuthForm, IAuthResponse } from '@/types/auth.types'
import { DASHBOARD_PAGES } from '@/config/pages-url.config'
import { authService } from '@/services/auth.service'
import { OtpForm } from './OtpForm' // Импорт формы OTP

export function Auth() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || DASHBOARD_PAGES.HOME

  const [isLoginForm, setIsLoginForm] = useState(true)
  const [isWaitingForOTP, setIsWaitingForOTP] = useState(false)
  const [emailForOTP, setEmailForOTP] = useState<string | null>(null)

  const { register, handleSubmit, reset } = useForm<IAuthForm>({ mode: 'onChange' })

  const mutation = useMutation({
    mutationKey: ['auth'],
    mutationFn: (data: IAuthForm) =>
      authService.main(isLoginForm ? 'login' : 'register', data),
    onSuccess: (data: IAuthResponse) => {
      if (data.otpRequired) {
        setEmailForOTP(data.email ?? null)
        setIsWaitingForOTP(true)
        toast('Введите OTP, отправленный на почту')
      } else if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken)
        toast.success(isLoginForm ? 'Login successful!' : 'Registration successful!')
        reset()
        console.log('Авторизация успешна! Переход на:', redirectUrl)
        window.location.href = '/i' // Заменено с push на replace
      } else {
        toast.error('Не удалось авторизоваться')
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Произошла ошибка')
    },
  })

  const onSubmit: SubmitHandler<IAuthForm> = (data) => mutation.mutate(data)

  // Обработка успешного ввода OTP
  const handleOtpSuccess = (accessToken: string) => {
    localStorage.setItem('accessToken', accessToken)
    toast.success('Авторизация успешна!')
    console.log('OTP успешен, редирект на:', redirectUrl)
window.location.href = '/i'
  }

  if (isWaitingForOTP && emailForOTP) {
    return (
      <OtpForm
        email={emailForOTP}
        onSuccess={handleOtpSuccess}
        onCancel={() => {
          setIsWaitingForOTP(false)
          setEmailForOTP(null)
          reset()
        }}
      />
    )
  }

  return (
    <div className="flex min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-1/4 m-auto shadow bg-sidebar rounded-xl p-layout flex flex-col items-center justify-center"
      >
        <Heading title="Auth" />

        <Field
          id="email"
          label="Email:"
          placeholder="Enter email:"
          type="email"
          extra="mb-4"
          {...register('email', { required: 'Email is required!' })}
        />

        <Field
          id="password"
          label="Password:"
          placeholder="Enter password:"
          type="password"
          extra="mb-6"
          {...register('password', { required: 'Password is required!' })}
        />

        <div className="flex items-center gap-5 justify-center flex flex-col items-center ">
          <button
            type="button"
            onClick={() => setIsLoginForm((prev) => !prev)}
            className=" hover:underline text-sm text-gray-600"
          >
            {isLoginForm ? "Don't have an account?" : 'Already have an account?'}
          </button>
          <Button type="submit">
            {isLoginForm ? 'Sign-in' : 'Sign-up'}
          </Button>
        </div>
      </form>
    </div>
  )
}
