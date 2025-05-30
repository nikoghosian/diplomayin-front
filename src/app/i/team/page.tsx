'use client'

import React, { useState, useCallback, useMemo } from 'react'
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
import { Tabs, Tab } from '@mui/material'

export default function TeamPage() {
  const { teams, isLoading, error } = useGetTeams()

  const [selectedTeam, setSelectedTeam] = useState<TeamFormType>()
  const [email, setEmail] = useState('')
  const [newTeamName, setNewTeamName] = useState('')
  const [creating, setCreating] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)

  const handleInvite = useCallback(async () => {
    if (!email.trim() || !selectedTeam) {
      toast.error('Please select a team and enter an email')
      return
    }
    try {
      await inviteToTeam(selectedTeam.id!, email.trim())
      toast.success(`Invitation successfully sent to ${email}`)
      setEmail('')
    } catch (err: any) {
      toast.error(err.message || 'Error sending invitation')
    }
  }, [email, selectedTeam])

  const handleRemove = useCallback(
    async (userId: string) => {
      if (!selectedTeam?.id) return
      try {
        await removeFromTeam(selectedTeam.id, userId)
        setSelectedTeam((prev) =>
          prev
            ? {
                ...prev,
                members: prev.members?.filter((m) => m.id !== userId),
              }
            : prev
        )
        toast.success('Member successfully removed')
      } catch (err: any) {
        toast.error(err.message || 'Error removing member')
      }
    },
    [selectedTeam]
  )

  const handleCreateTeam = useCallback(async () => {
    if (!newTeamName.trim()) return
    setCreating(true)
    try {
      const createdTeam = await createTeam(newTeamName.trim())
      setSelectedTeam(createdTeam)
      toast.success(`Team "${createdTeam.name}" successfully created`)
      setNewTeamName('')
    } catch (err: any) {
      toast.error(err.message || 'Error creating team')
    } finally {
      setCreating(false)
    }
  }, [newTeamName])

  const teamMembers = useMemo(() => selectedTeam?.members ?? [], [selectedTeam])

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    )

  if (error) return <div className="p-10 text-red-500">Error: {error}</div>

  return (
    <div className="p-10 min-h-screen text-black max-w-xl relative">
      <Tabs
        value={tabIndex}
        onChange={(_, newValue) => setTabIndex(newValue)}
        textColor="primary"
        indicatorColor="primary"
        sx={{
          marginBottom: 4,
          background: '#1f1f1f',
          borderRadius: '8px',
          '& .MuiTab-root': {
            color: 'white',
            minWidth: 120,
            marginRight: '24px',
          },
          '& .MuiTab-root:last-child': {
            marginRight: 0,
          },
        }}
        centered
      >
        <Tab label="Select" />
        <Tab label="Create" />
        <Tab label="Invite" />
      </Tabs>

      {/* TAB 1: Select team */}
      {tabIndex === 0 && (
        <div>
          <TeamSelect teams={teams} initialData={selectedTeam} onSelectTeam={setSelectedTeam} />
          {selectedTeam ? (
            <>
              <p className="text-white font-semibold mt-6">You selected team: {selectedTeam.name}</p>
              {teamMembers.length > 0 ? (
                <div className="mt-4">
                  <h3 className="text-white font-bold mb-2">Team members:</h3>
                  <ul className="space-y-2">
                    {teamMembers.map((member) => (
                      <li
                        key={member.id}
                        className="flex justify-between items-center bg-gray-800 text-white p-2 rounded"
                      >
                        <span>{member.name}</span>
                        <button
                          onClick={() => handleRemove(member.id)}
                          className="text-red-400 hover:text-red-600 text-sm"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                null
              )}
            </>
          ) : (
            <p className="text-white italic mt-4">Please select a team first</p>
          )}
        </div>
      )}

      {/* TAB 2: Create team */}
      {tabIndex === 1 && (
        <div className="max-w-lg">
          <label className="text-sm font-semibold mb-1 block text-white">Create a new team:</label>
          <input
            type="text"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="Team name"
            className="border border-gray-600 text-white rounded px-4 py-2 w-full mb-2"
            style={{ background: 'var(--primary)' }}
            disabled={creating}
            autoFocus
          />
          <button
            onClick={handleCreateTeam}
            disabled={creating || !newTeamName.trim()}
            className="bg-blue-700 hover:bg-blue-900 text-white py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? 'Creating...' : 'Create team'}
          </button>
        </div>
      )}

      {/* TAB 3: Invite member */}
      {tabIndex === 2 && (
        <div className="max-w-lg">
          <label className="text-sm font-semibold block mb-1 text-white">Select a team:</label>
          <TeamSelect teams={teams} initialData={selectedTeam} onSelectTeam={setSelectedTeam} />

          {selectedTeam ? (
            <>
              <label className="text-sm font-semibold block mt-4 mb-1 text-white">Email to invite:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-600 text-white rounded px-4 py-2 w-full placeholder-black"
                placeholder="Enter email"
                style={{ background: 'var(--primary)' }}
                autoFocus
              />
              <button
                onClick={handleInvite}
                className="mt-3 bg-gray-700 hover:bg-gray-900 text-white py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!email.trim() || !selectedTeam}
              >
                Send invitation
              </button>
            </>
          ) : (
            <p className="text-white italic mt-4">Please select a team first</p>
          )}
        </div>
      )}
    </div>
  )
}
