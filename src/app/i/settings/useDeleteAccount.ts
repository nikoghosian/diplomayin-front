'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { userService } from '@/services/user.service'

export function useDeleteAccount() {
	const [isPending, setIsPending] = useState(false)
	const router = useRouter()

	const handleDelete = async () => {
		const confirmed = window.confirm(
			'Are you sure? This will permanently delete ALL your data and cannot be undone!'
		)

		if (!confirmed) return

		setIsPending(true)
		try {
			await userService.deleteAccount()

			localStorage.removeItem('token')
			sessionStorage.clear()

			const cookies = document.cookie.split(';')
			for (const cookie of cookies) {
				const name = cookie.trim().split('=')[0]
				document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
				document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`
			}

			window.location.href = '/auth'
		} catch (error: any) {
			console.error('Delete account error:', error)
			toast.error(error?.message || 'Failed to delete account')
		} finally {
			setIsPending(false)
		}
	}

	return {
		deleteAccount: handleDelete,
		isPending
	}
}
