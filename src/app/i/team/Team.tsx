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
      <label className="block font-medium mb-2 text-white">Выберите команду:</label>
      <button
        className="w-full bg-[var(--primary)] text-white border border-gray-700 hover:bg-gray-600/30 border-opacity-30 rounded px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-gray-500 flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        {selected ? selected.name : '-- Выберите --'}
        <span className="ml-2 text-sm hover:bg-gray-600/30 select-none">▼</span>
      </button>

      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-[#0e0f0f] border border-gray-700 border-opacity-30 rounded max-h-60 overflow-auto shadow-lg animate-fade">
          {teams.length === 0 ? (
            <li className="px-4 py-2 border-b border-gray-700 border-opacity-30 text-gray-400 cursor-default select-none">
              Нет команд
            </li>
          ) : (
            teams.map((team, idx) => (
              <li
                key={team.name}
                onClick={() => handleSelect(team)}
                className={`cursor-pointer px-4 py-2 hover:bg-gray-600/30 ${
                  selected?.name === team.name ? 'bg-gray-700/30 font-semibold' : ''
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
      toast.error('Команда не выбрана')
      return
    }
    if (!inviteEmail || !inviteEmail.includes('@')) {
      toast.error('Введите корректный email')
      return
    }

    try {
      await inviteToTeam(selectedTeam.id, inviteEmail)
      toast.success('Приглашение отправлено')
      setInviteEmail('')
    } catch (err: any) {
      toast.error(err.message || 'Ошибка при приглашении')
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-[#0e0f0f] p-6 rounded shadow-lg text-white">
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          className={`px-4 py-2 rounded ${
            mode === 'select' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
          }`}
          onClick={() => setMode('select')}
          disabled={isPending}
        >
          выбрать
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded ${
            mode === 'create' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
          }`}
          onClick={() => setMode('create')}
          disabled={isPending}
        >
          Создать
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
              <label className="block mb-1 text-white font-medium">Пригласить по email:</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="email@example.com"
                className="border border-gray-700 rounded px-3 py-2 w-full bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <button
                onClick={handleInvite}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
              >
                Пригласить
              </button>
            </div>
          )}
        </>
      )}

      {mode === 'create' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Название команды</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-700 rounded px-3 py-2 w-full bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={isPending}
              required
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={isPending}>
              Сохранить
            </button>
            <button
              type="button"
              className="bg-red-600 text-white px-4 py-2 rounded"
              onClick={onDelete}
              disabled={isPending}
            >
              Удалить
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
        if (!token) throw new Error('Токен не найден')
console.log('TOKEN:', token)

        const res = await fetch('http://localhost:4200/api/user/team', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error('Не удалось получить команды')

        const data = await res.json()
        setTeams(data.map((team: { name: string; id: string }) => ({ name: team.name, id: team.id })))
      } catch (err: any) {
        console.error('Ошибка при загрузке команд:', err)
        toast.error(err.message || 'Ошибка при загрузке команд')
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
    if (!accessToken) throw new Error('Токен не найден')

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
      throw new Error(errorData.message || 'Ошибка при приглашении')
    }

    return await res.json()
  } catch (error) {
    console.error('Ошибка при приглашении в команду:', error)
    throw error
  }
}

export async function removeFromTeam(teamId: string, userId: string) {
  const response = await fetch(`http://localhost:4200/api/user/team-member/${teamId}/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Не удалось удалить участника')
  }
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

    return await res.json() // Возвращаем созданную команду
  } catch (e: any) {
    toast.error(e.message || 'Ошибка при создании команды')
    throw e
  }
}

export async function deleteTeam(id: string) {
  try {
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/)
      if (match) accessToken = decodeURIComponent(match[1])
    }
    if (!accessToken) throw new Error('Токен не найден')

    const res = await fetch(`http://localhost:4200/api/user/team/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Ошибка при удалении команды')
    }
  } catch (e: any) {
    toast.error(e.message || 'Ошибка при удалении команды')
    throw e
  }
}
