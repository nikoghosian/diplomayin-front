'use client'

import { useQuery } from '@tanstack/react-query'

import { IProfileResponse, userService } from '@/services/user.service'

export function useProfile() {
	const { data, isLoading, isSuccess, error } = useQuery<IProfileResponse>({
		queryKey: ['profile'],
		queryFn: () => userService.getProfile()
	})

	return { data, isLoading, isSuccess, error }
}
