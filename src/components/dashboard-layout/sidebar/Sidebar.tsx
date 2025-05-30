'use client'

import { GanttChartSquare } from 'lucide-react'
import Link from 'next/link'

import { COLORS } from '@/constants/color.constants'

import { LogoutButton } from './LogoutButton'
import { MenuItem } from './MenuItem'
import { MENU } from './menu.data'

export function Sidebar() {
  return (
    <aside className="border-r border-border h-full bg-sidebar flex flex-col justify-between shadow-lg">
      {/* Header */}
      <div className="flex flex-col h-full">
        <Link
          href="/"
          className="flex items-center gap-3 p-layout border-b border-border hover:bg-sidebar-hover transition-colors"
        >
          <GanttChartSquare
            color={COLORS.primary}
            size={38}
            className="drop-shadow-lg"
          />
          <span className="text-2xl font-bold relative tracking-wide text-sidebar-text">
            Task Management
          </span>
        </Link>

        {/* Menu Content */}
        <div className="flex-1 flex flex-col p-4 overflow-y-auto">
          <div className="mb-2 relative">
            <LogoutButton />
          </div>
          
          <nav className="flex-1">
            <ul className="space-y-1">
              {MENU.map(item => (
                <li key={item.link}>
                  <MenuItem item={item} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-xs opacity-50 font-normal text-center p-layout border-t border-border bg-sidebar-footer py-3">
        <div className="text-sidebar-text">
          <>
            <span className="text-primary">Task Management</span> © 2025
          </>
		  <br />
        </div>
      </footer>
    </aside>
  )
}