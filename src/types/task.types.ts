import type { IBase } from './root.types'

export enum EnumTaskPriority {
	low = 'low',
	medium = 'medium',
	high = 'high'
}
export enum EnumTaskProgress {
	in_progress = 'in_progress',
	completed = 'completed',
	not_started = 'not_started'
	
}

export interface ITaskResponse extends IBase {
	name: string
	priority?: EnumTaskPriority
	isCompleted: boolean
	progress?: EnumTaskProgress
}

export type TypeTaskFormState = Partial<Omit<ITaskResponse, 'id' | 'updatedAt'>>
