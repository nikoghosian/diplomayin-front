'use client'
import React from 'react'
import { BarChart } from '@mui/x-charts/BarChart'
import { useProfile } from '../../hooks/useProfile'
import CircularProgress from '@mui/material/CircularProgress'

export function Statistics() {
  const { data, isLoading } = useProfile()

  if (isLoading)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </div>
    )

  if (!data?.statistics?.length) return <div>Statistics not loaded!</div>

  const labels = data.statistics.map((item) => item.label)

  // Отдельно отделяем Completed tasks
  const completedItem = data.statistics.find((item) => item.label === 'Completed tasks')
  const completedValue = completedItem ? completedItem.value : null

  // Массивы для двух серий: остальные задачи и Completed
  const otherData = data.statistics.map((item) =>
    item.label !== 'Completed tasks' ? Number(item.value) : null
  )
  const completedData = data.statistics.map((item) =>
    item.label === 'Completed tasks' ? Number(item.value) : null
  )

  return (
    <div
      style={{
        backgroundColor: '#222',
        padding: 10,
        borderRadius: 8,
        maxWidth: 5500,
        margin: 'auto',
        marginTop: 100,
      }}
    >
      <BarChart
        xAxis={[
          {
            id: 'categories',
            data: labels,
            scaleType: 'band',
            tickLabelStyle: { fill: '#fff', fontSize: 12 },
          },
        ]}
        yAxis={[
          {
            label: 'Value',
            width: 60,
            labelStyle: { fill: '#eee', fontSize: 12 },
            tickLabelStyle: { fill: '#eee', fontSize: 12 },
          },
        ]}
        grid={{
          horizontal: true,
          vertical: false,
        }}
        series={[
          {
            data: otherData,
            label: '',
            color: '#1976d2', // синий
          },
          {
            data: completedData,
            label: '',
            color: '#4caf50', // зелёный для Completed tasks
          },
        ]}
        height={300}
        sx={{
          '& .MuiChartsAxis-line': {
            stroke: 'white',
            strokeWidth: 2,
          },
          '& .MuiChartsAxis-tick': {
            stroke: '#9e9e9e',
          },
          '& .MuiChartsGrid-line': {
            stroke: '#424242',
            strokeDasharray: '3 3',
          },
        }}
        margin={{
          top: 20,
          right: 30,
          bottom: 40,
          left: 65,
        }}
      />
    </div>
  )
}
