import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

export function useGetTeams() {
	const [teams, setTeams] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchTeams = useCallback(async () => {
		setIsLoading(true)
		try {
			const response = await axios.get('/api/team')
			setTeams(response.data)
			setError(null)
		} catch (err: any) {
			console.error(err)
			toast.error(err?.response?.data?.message || 'Failed to fetch teams')
			setError(err.message)
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchTeams()
	}, [fetchTeams])

	return { teams, isLoading, error, refetchTeams: fetchTeams }
}
