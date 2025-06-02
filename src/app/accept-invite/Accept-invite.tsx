'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import CircularProgress from '@mui/material/CircularProgress'

export default function AcceptInvitePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const acceptInvite = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const inviteToken = urlParams.get('token')
      const accessToken = localStorage.getItem('accessToken')

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
          }
        })

        const data = await res.json()

        if (!res.ok) throw new Error(data.message || 'Ошибка при принятии приглашения.')

        toast.success(data.message || 'Приглашение принято!')
        router.push('/team')
      } catch (err: any) {
        if (err.message === 'Invite already used' || err.message === 'Приглашение уже использовано') {
          router.push('/team')
        } else {
          toast.error(err.message || 'Ошибка при принятии приглашения.')
          router.push('/auth')
        }
      } finally {
        setLoading(false)
      }
    }

    acceptInvite()
  }, [router])

  if (loading)
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: 'white' }} />
      </div>
    )

  return null
}
