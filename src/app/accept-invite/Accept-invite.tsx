'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function AcceptInvitePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const acceptInvite = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const inviteToken = urlParams.get('token')
      const accessToken = localStorage.getItem('accessToken')
      const userEmail = localStorage.getItem('email') // если нужно

      if (!accessToken) {
        router.push('/auth')
        return
      }

      if (!inviteToken) {
        toast.error('Пригласительный токен отсутствует')
        router.push('/')
        return
      }

      try {
       const url = new URL('http://localhost:4200/api/user/team-member/accept-invite')
url.searchParams.append('token', inviteToken)

const res = await fetch(url.toString(), {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  // Убираем body
})

        const data = await res.json()

        if (!res.ok) throw new Error(data.message || 'Ошибка при принятии приглашения.')

        toast.success(data.message || 'Приглашение принято!')
        router.push('/team')
      } catch (err: any) {
        toast.error(err.message || 'Ошибка при принятии приглашения.')
        router.push('/auth')
      } finally {
        setLoading(false)
      }
    }

    acceptInvite()
  }, [router])

  if (loading) return <p>Подтверждаем приглашение...</p>
  return null
}
