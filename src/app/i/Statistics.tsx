'use client'
import React from 'react'
import { BarChart } from '@mui/x-charts/BarChart'
import { useProfile } from '../../hooks/useProfile'
import CircularProgress from '@mui/material/CircularProgress'

interface StatisticItem {
  label: string
  value: number
  isDaily?: boolean
}

interface RawStatisticItem {
  label: string
  value: string | number
  isDaily?: boolean
}

// Проверка, является ли строка датой в формате YYYY-MM-DD
const isDateString = (str: string) => {
  return /^\d{4}-\d{2}-\d{2}$/.test(str)
}

// Если это дата и она в будущем, то вернуть 'Later'
const normalizeLabel = (label: string): string => {
  if (isDateString(label)) {
    const now = new Date()
    const date = new Date(label)
    if (date > now) {
      return 'Later'
    }
  }
  return label
}

export function Statistics() {
  const { data, isLoading } = useProfile()

  if (isLoading)
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: 'white' }} />
      </div>
    )

  if (!data?.statistics?.length) return <div>Statistics not loaded!</div>

  const rawData: StatisticItem[] = data.statistics.map((item: RawStatisticItem) => ({
    label: normalizeLabel(String(item.label)),
    value: Number(item.value),
    isDaily: item.isDaily ?? false,
  }))

  const xCategories = rawData.map((item) => item.label)

  return (
    <div
      style={{
        backgroundColor: '#222',
        padding: 10,
        borderRadius: 8,
        maxWidth: 600,
        margin: 'auto',
      }}
    >
      <BarChart
        xAxis={[
          {
            id: 'categories',
            data: xCategories,
            scaleType: 'band',
            tickLabelStyle: { fill: '#eee', fontSize: 12 },
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
        series={[
          {
            data: rawData.map((item) => item.value),
            label: 'Statistics',
            color: '#1976d2',
          },
        ]}
        height={300}
      />
    </div>
  )
}
