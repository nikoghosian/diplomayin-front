'use client'

import { useRouter } from 'next/navigation'
import Loader from '@/components/ui/Loader'
import { useProfile } from '@/hooks/useProfile'
import { useState } from 'react'

export function Profile() {
  const { data, isLoading } = useProfile()
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const handleClick = () => {
    if (isNavigating) return 

    setIsNavigating(true)
    setTimeout(() => {
      router.push('/i/settings')
    }, 100) 
  }

  return (
    <div className='absolute top-big-layout right-big-layout'>
      {isLoading ? (
        <Loader />
      ) : (
        <div className='flex items-center cursor-pointer' onClick={handleClick}>
          <div className='text-right mr-3'>
            <p className='font-bold -mb-1'>{data?.user.name}</p>
            <p className='text-sm opacity-40'>{data?.user.email}</p>
          </div>

          <div className='w-10 h-10 flex justify-center items-center text-2xl text-white bg-white/20 rounded uppercase'>
            {data?.user.name?.charAt(0) || 'A'}
          </div>
        </div>
      )}
    </div>
  )
}
