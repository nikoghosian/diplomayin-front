import axios, { type CreateAxiosDefaults } from 'axios'

import { errorCatch } from './error'
import {
	getAccessToken,
	removeFromStorage
} from '@/services/auth-token.service'
import { authService } from '@/services/auth.service'

const options: CreateAxiosDefaults = {
	baseURL: 'http://localhost:4200/api',
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true
}

const axiosClassic = axios.create(options)
const axiosWithAuth = axios.create(options)

axiosWithAuth.interceptors.request.use(config => {
	const accessToken = getAccessToken()
	if (config?.headers && accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`
	}
	return config
})

axiosWithAuth.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config

		if (
			(error?.response?.status === 401 ||
				errorCatch(error) === 'jwt expired' ||
				errorCatch(error) === 'jwt must be provided') &&
			originalRequest &&
			!originalRequest._isRetry
		) {
			originalRequest._isRetry = true
			try {
				const response = await authService.getNewTokens()
				const newAccessToken = response.data.accessToken

				if (newAccessToken) {
					localStorage.setItem('accessToken', newAccessToken)
					axiosWithAuth.defaults.headers.common['Authorization'] =
						`Bearer ${newAccessToken}`
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
					return axiosWithAuth.request(originalRequest)
				}
			} catch (refreshError) {
				removeFromStorage()
				window.location.href = '/auth'
				return Promise.reject(refreshError)
			}
		}

		return Promise.reject(error)
	}
)

export { axiosClassic, axiosWithAuth }
