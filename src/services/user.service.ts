import axios from 'axios'

import { IUser, TypeUserForm } from '@/types/auth.types'

import { axiosWithAuth } from '@/api/interceptors'

export interface IProfileResponse {
	user: IUser
	statistics: {
		label: string
		value: string
	}[]
}

class UserService {
	private BASE_URL = '/user/profile'

	async getProfile(): Promise<IProfileResponse> {
		try {
			const response = await axiosWithAuth.get<IProfileResponse>(this.BASE_URL)
			return response.data
		} catch (error: any) {
			if (
				error.response?.status === 400 ||
				error.response?.status === 401 ||
				error.response?.status === 403
			) {
				localStorage.removeItem('accessToken')
				throw new Error('Unauthorized')
			}
			throw error
		}
	}

	async update(data: TypeUserForm) {
		const response = await axiosWithAuth.put(this.BASE_URL, data)
		return response.data
	}

	async deleteAccount() {
		const response = await axiosWithAuth.delete(this.BASE_URL)
		return response.data
	}
}

export const userService = new UserService()
