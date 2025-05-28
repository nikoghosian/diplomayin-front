import type { LucideIcon } from 'lucide-react'
import type { SvgIconComponent } from '@mui/icons-material'

export interface IMenuItem {
  link: string
  name: string
  icon: LucideIcon | SvgIconComponent
}
