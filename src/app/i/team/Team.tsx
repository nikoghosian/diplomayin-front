'use client'

import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'

export type TeamFormType = {
  name: string
  id?: string
  members?: { id: string; name: string }[]
}

interface TeamSelectProps {
  teams: TeamFormType[]
  onSelectTeam: (team: TeamFormType) => void
  initialData?: TeamFormType
  selectedTeam?: TeamFormType
}

export const TeamSelect: React.FC<TeamSelectProps> = ({ teams, onSelectTeam, initialData, selectedTeam }) => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<TeamFormType | undefined>(initialData)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setSelected(initialData)
  }, [initialData])

  const handleSelect = (team: TeamFormType) => {
    setSelected(team)
    onSelectTeam(team)
    setOpen(false)
  }

  return (
    <div className="relative w-full max-w-sm" ref={dropdownRef}>
      <label className="block font-medium mb-2 text-white">Select Team</label>
      <button
        className="w-full bg-[var(--primary)] text-white border border-gray-700 hover:bg-blue-700 border-opacity-60 rounded px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        {selected ? selected.name : 'Select a team'}
        <span className="ml-2 text-sm select-none">▼</span>
      </button>

      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-[#0e0f0f] border border-gray-700 border-opacity-50 rounded max-h-60 overflow-auto shadow-lg animate-fade">
          {teams.length === 0 ? (
            <li className="px-4 py-2 border-b border-gray-700 border-opacity-30 text-gray-400 cursor-default select-none">
              No teams
            </li>
          ) : (
            teams.map((team, idx) => (
              <li
                key={team.name}
                onClick={() => handleSelect(team)}
                className={`cursor-pointer px-4 py-2 hover:bg-blue-700 ${
                  selected?.name === team.name ? 'bg-blue-800 font-semibold' : ''
                } ${idx !== teams.length - 1 ? 'border-b border-gray-700 border-opacity-20' : ''}`}
              >
                {team.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}

interface TeamFormProps {
  initialData?: TeamFormType
  onSave: (data: TeamFormType) => void
  onDelete: () => void
  isPending: boolean
  teams: TeamFormType[]
  onSelectTeam: (team: TeamFormType) => void
}

export function TeamForm({
  initialData,
  onSave,
  onDelete,
  isPending,
  teams,
  onSelectTeam,
}: TeamFormProps) {
  const [form, setForm] = useState<TeamFormType>(initialData || { name: '' })
  const [mode, setMode] = useState<'select' | 'create'>(initialData ? 'select' : 'create')
  const [selectedTeam, setSelectedTeam] = useState<TeamFormType | undefined>(initialData)
  const [inviteEmail, setInviteEmail] = useState('')

  useEffect(() => {
    if (initialData) {
      setForm(initialData)
      setMode('select')
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
  }

  const handleSelect = (team: TeamFormType) => {
    setSelectedTeam(team)
    onSelectTeam(team)
  }

  const handleInvite = async () => {
    if (!selectedTeam?.id) {
      toast.error('Team not selected')
      return
    }
    if (!inviteEmail || !inviteEmail.includes('@')) {
      toast.error('Enter a valid email')
      return
    }

    try {
      await inviteToTeam(selectedTeam.id, inviteEmail)
      toast.success('Invitation sent')
      setInviteEmail('')
    } catch (err: any) {
      toast.error(err.message || 'Error sending invitation')
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-[#0e0f0f] p-6 rounded shadow-lg text-white">
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          className={`px-4 py-2 rounded transition-colors duration-200 ${
            mode === 'select' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
          onClick={() => setMode('select')}
          disabled={isPending}
        >
          Select
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded transition-colors duration-200 ${
            mode === 'create' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
          onClick={() => setMode('create')}
          disabled={isPending}
        >
          Create
        </button>
      </div>

      {mode === 'select' && teams.length > 0 && (
        <>
          <TeamSelect
            teams={teams}
            onSelectTeam={handleSelect}
            initialData={initialData}
            selectedTeam={selectedTeam}
          />

          {selectedTeam && (
            <div className="mt-4">
              <label className="block mb-1 text-white font-medium">Invite via email:</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="email@example.com"
                className="border border-gray-700 rounded px-3 py-2 w-full bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleInvite}
                className="mt-2 bg-green-600 hover:bg-green-700 transition-colors text-white px-4 py-2 rounded"
              >
                Invite
              </button>
            </div>
          )}
        </>
      )}

      {mode === 'create' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Team Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-700 rounded px-3 py-2 w-full bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPending}
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 rounded"
              disabled={isPending}
            >
              Save
            </button>
            <button
              type="button"
              className="bg-red-600 hover:bg-red-700 transition-colors text-white px-4 py-2 rounded"
              onClick={onDelete}
              disabled={isPending}
            >
              Delete
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export function useGetTeams() {
  const [teams, setTeams] = useState<TeamFormType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        let token = localStorage.getItem('accessToken')
        if (!token) {
          const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/)
          if (match) token = decodeURIComponent(match[1])
        }
        if (!token) throw new Error('Token not found')
        console.log('TOKEN:', token)

        const res = await fetch('http://localhost:4200/api/user/team', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error('Failed to fetch teams')

        const data = await res.json()
        setTeams(data.map((team: { name: string; id: string }) => ({ name: team.name, id: team.id })))
      } catch (err: any) {
        console.error('Error loading teams:', err)
        toast.error(err.message || 'Error loading teams')
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeams()
  }, [])

  return { teams, isLoading, error }
}

export async function inviteToTeam(teamId: string, email: string) {
  try {
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/)
      if (match) accessToken = decodeURIComponent(match[1])
    }
    if (!accessToken) throw new Error('Token not found')

    const res = await fetch(`http://localhost:4200/api/user/team-member/${teamId}/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ email }),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || 'Error sending invitation')
    }

    return await res.json()
  } catch (error) {
    console.error('Error inviting to team:', error)
    throw error
  }
}

export async function removeFromTeam(teamId: string, userId: string) {
  const response = await fetch(`http://localhost:4200/api/user/team-member/${teamId}/${userId}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to remove user from team')
  }
  return response.json()
}
export async function createTeam(name: string) {
  try {
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/)
      if (match) accessToken = decodeURIComponent(match[1])
    }
    if (!accessToken) throw new Error('Токен не найден')

    const res = await fetch('http://localhost:4200/api/user/team', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Ошибка при создании команды')
    }

    return await res.json() 
  } catch (e: any) {
    toast.error(e.message || 'Ошибка при создании команды')
    throw e
  }
}