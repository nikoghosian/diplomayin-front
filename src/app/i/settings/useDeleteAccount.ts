'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { userService } from '@/services/user.service'

export function useDeleteAccount() {
	const router = useRouter()

	const handleDelete = async () => {
		const confirmed = window.confirm(
			'Are you sure? This will permanently delete ALL your data and cannot be undone!'
		)

		if (!confirmed) return

		try {
			await userService.deleteAccount()

			// Удаляем токены и очищаем хранилище
			localStorage.removeItem('token')
			sessionStorage.clear()

			// Чистим куки вручную
			const cookies = document.cookie.split(';')
			for (const cookie of cookies) {
				const name = cookie.trim().split('=')[0]
				document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
				document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`
			}

			// Перенаправляем на авторизацию
			window.location.href = '/auth'
		} catch (error: any) {
			console.error('Delete account error:', error)
			toast.error(error?.message || 'Failed to delete account')
		}
	}

	return {
		deleteAccount: handleDelete
	}
}
