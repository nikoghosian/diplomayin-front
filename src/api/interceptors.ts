// /api/interceptors.ts
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
	withCredentials: true // важно, чтобы refreshToken передавался автоматически (cookie)
}

const axiosClassic = axios.create(options)
const axiosWithAuth = axios.create(options)

// Добавляем accessToken к каждому запросу
axiosWithAuth.interceptors.request.use(config => {
	const accessToken = getAccessToken()
	if (config?.headers && accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`
	}
	return config
})

// Обрабатываем ошибки и пробуем обновить токен
axiosWithAuth.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config

		// Проверка на 401 и ошибки с истекшим JWT
		if (
			(error?.response?.status === 401 ||
				errorCatch(error) === 'jwt expired' ||
				errorCatch(error) === 'jwt must be provided') &&
			originalRequest &&
			!originalRequest._isRetry
		) {
			originalRequest._isRetry = true
			try {
				// Запрос на обновление токенов через refreshToken (cookie)
				const response = await authService.getNewTokens()
				const newAccessToken = response.data.accessToken

				if (newAccessToken) {
					// Сохраняем новый токен в localStorage (или где у тебя)
					localStorage.setItem('accessToken', newAccessToken)
					// Обновляем заголовок для последующих запросов
					axiosWithAuth.defaults.headers.common['Authorization'] =
						`Bearer ${newAccessToken}`
					// Повторяем исходный запрос с новым токеном
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
					return axiosWithAuth.request(originalRequest)
				}
			} catch (refreshError) {
				// Если обновить не удалось — очищаем и редиректим на логин
				removeFromStorage()
				window.location.href = '/auth'
				return Promise.reject(refreshError)
			}
		}

		return Promise.reject(error)
	}
)

export { axiosClassic, axiosWithAuth }
