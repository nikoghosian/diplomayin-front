'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'

import { IAuthForm } from '@/types/auth.types'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import { authService } from '@/services/auth.service'

export function Auth() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || DASHBOARD_PAGES.HOME

  const { register, handleSubmit, reset } = useForm<IAuthForm>({
    mode: 'onChange'
  })

  const [isLoginForm, setIsLoginForm] = useState(true) 

 const { mutate } = useMutation({
  mutationKey: ['auth'],
  mutationFn: (data: IAuthForm) => {
    console.log('Sending data:', data)
    return authService.main(isLoginForm ? 'login' : 'register', data)
  },
  onSuccess: (data) => {
    if (data?.accessToken) {
      localStorage.setItem('accessToken', data.accessToken)
    } else {
      console.warn('Нет accessToken в ответе')
    }

    toast.success(isLoginForm ? 'Успешный вход!' : 'Успешная регистрация!')
    reset()
    router.push(redirectUrl)
  },
  onError: (error: any) => {
    toast.error(error.response?.data?.message || 'Произошла ошибка')
  }
})


  const onSubmit: SubmitHandler<IAuthForm> = data => {
    mutate(data)
  }

  return (
    <div className='flex min-h-screen'>
      <form
        className='w-1/4 m-auto shadow bg-sidebar rounded-xl p-layout'
        onSubmit={handleSubmit(onSubmit)}
      >
        <Heading title='Auth' />

        <Field
          id='email'
          label='Email:'
          placeholder='Enter email:'
          type='email'
          extra='mb-4'
          {...register('email', {
            required: 'Email is required!'
          })}
        />

        <Field
          id='password'
          label='Password: '
          placeholder='Enter password: '
          type='password'
          {...register('password', {
            required: 'Password is required!'
          })}
          extra='mb-6'
        />

        <div className='flex items-center gap-5 justify-center'>
          <Button type='submit'>{isLoginForm ? 'Войти' : 'Зарегистрироваться'}</Button>
          <button
            type='button'
            onClick={() => setIsLoginForm(prev => !prev)}
            className='underline text-sm text-gray-600'
          >
            {isLoginForm ? 'Перейти к регистрации' : 'Перейти к входу'}
          </button>
        </div>
      </form>
    </div>
  )
}
