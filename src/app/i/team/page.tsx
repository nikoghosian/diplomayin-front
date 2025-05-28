'use client'

import React, { useState } from 'react'
import {
  TeamSelect,
  useGetTeams,
  TeamFormType,
  inviteToTeam,
  removeFromTeam,
  createTeam,
} from './Team'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { toast } from 'sonner'

export default function TeamPage() {
  const { teams, isLoading, error } = useGetTeams()

  const [selectedTeam, setSelectedTeam] = useState<TeamFormType | undefined>(undefined)
  const [email, setEmail] = useState('')
  const [newTeamName, setNewTeamName] = useState('')
  const [creating, setCreating] = useState(false)

  const handleInvite = async () => {
    if (!email.trim() || !selectedTeam) {
      toast.error('Пожалуйста, выберите команду и введите email')
      return
    }
    try {
      await inviteToTeam(selectedTeam.id!, email.trim())
      toast.success(`Приглашение успешно отправлено на ${email}`)
      setEmail('')
    } catch (err: any) {
      toast.error(err.message || 'Ошибка при отправке приглашения')
    }
  }

  const handleRemove = async (userId: string) => {
    if (!selectedTeam?.id) return
    try {
      await removeFromTeam(selectedTeam.id, userId)
      setSelectedTeam({
        ...selectedTeam,
        members: selectedTeam.members?.filter((m) => m.id !== userId),
      })
      toast.success('Участник успешно удалён')
    } catch (err: any) {
      toast.error(err.message || 'Ошибка при удалении участника')
    }
  }

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return
    setCreating(true)
    try {
      const createdTeam = await createTeam(newTeamName.trim())
      setSelectedTeam(createdTeam)
      toast.success(`Команда "${createdTeam.name}" успешно создана`)
      setNewTeamName('')
      // refetchTeams() убран, можно добавить обновление локального состояния команд, если нужно
    } catch (err: any) {
      toast.error(err.message || 'Ошибка при создании команды')
    } finally {
      setCreating(false)
    }
  }

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    )

  if (error) return <div className="p-10 text-red-500">Ошибка: {error}</div>

  return (
    <div className="p-10 min-h-screen text-black max-w-xl relative">
      {/* Секция создания новой команды */}
      <div className="mb-6 max-w-md">
        <label className="text-sm font-semibold mb-1 block text-white">Создать новую команду:</label>
        <input
          type="text"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          placeholder="Название команды"
          className="border border-gray-600 text-white rounded px-4 py-2 w-full mb-2"
          style={{ background: 'var(--primary)' }}
          disabled={creating}
        />
        <button
          onClick={handleCreateTeam}
          disabled={creating || !newTeamName.trim()}
          className="bg-blue-700 hover:bg-blue-900 text-white py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {creating ? 'Создание...' : 'Создать команду'}
        </button>
      </div>

      {/* Выбор команды */}
      <TeamSelect teams={teams} initialData={selectedTeam} onSelectTeam={setSelectedTeam} />

      <div className="mt-6 text-left text-lg">
        {selectedTeam ? (
          <>
            <p className="text-white font-semibold mb-4">Вы выбрали команду: {selectedTeam.name}</p>

            <div className="flex flex-col gap-4 mb-6 max-w-md">
              <label className="text-sm bg-black text-white">Email для приглашения:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-600 text-white rounded px-4 py-2 placeholder-black focus:outline-none focus:ring-2 focus:ring-gray-700"
                placeholder="Введите email"
                style={{ background: 'var(--primary)' }}
              />

              <button
                onClick={handleInvite}
                className="bg-gray-700 hover:bg-gray-900 text-white py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!email.trim() || !selectedTeam}
              >
                Отправить приглашение
              </button>
            </div>

            {/* Список участников */}
            {selectedTeam.members && selectedTeam.members.length > 0 ? (
              <div className="mt-6">
                <h3 className="text-white font-bold mb-2">Участники команды:</h3>
                <ul className="space-y-2">
                  {selectedTeam.members.map((member) => (
                    <li
                      key={member.id}
                      className="flex justify-between items-center bg-gray-800 text-white p-2 rounded"
                    >
                      <span>{member.name}</span>
                      <button
                        onClick={() => handleRemove(member.id)}
                        className="text-red-400 hover:text-red-600 text-sm"
                      >
                        Удалить
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-400 italic mt-6">У команды нет участников</p>
            )}
          </>
        ) : (
          <p className="text-white italic">Сначала выберите команду</p>
        )}
      </div>
    </div>
  )
}  