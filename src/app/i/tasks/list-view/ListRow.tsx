import cn from 'clsx'
import { GripVertical, Loader, Trash } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useEffect } from 'react'

import Checkbox from '@/components/ui/checkbox'
import { TransparentField } from '@/components/ui/fields/TransparentField'
import { SingleSelect } from '@/components/ui/task-edit/SingleSelect'
import { DatePicker } from '@/components/ui/task-edit/date-picker/DatePicker'

import type { ITaskResponse, TypeTaskFormState } from '@/types/task.types'
import { EnumTaskProgress } from '@/types/task.types'

import { useDeleteTask } from '../hooks/useDeleteTask'
import { useTaskDebounce } from '../hooks/useTaskDebounce'

import styles from './ListView.module.scss'

interface IListRow {
	item: ITaskResponse
	setItems: Dispatch<SetStateAction<ITaskResponse[] | undefined>>
}

export function ListRow({ item, setItems }: IListRow) {
	const { register, control, watch, setValue } = useForm<TypeTaskFormState>({
		defaultValues: {
			name: item.name,
			isCompleted: item.isCompleted || item.progress === EnumTaskProgress.completed,
			createdAt: item.createdAt,
			priority: item.priority,
			progress: item.progress
		}
	})

	const isCompleted = watch('isCompleted')
	const progress = watch('progress')

	// Синхронизация: если прогресс = completed, то isCompleted тоже true
	useEffect(() => {
		if (progress === EnumTaskProgress.completed && !isCompleted) {
			setValue('isCompleted', true)
		}
	}, [progress])

	// Синхронизация: если isCompleted, то progress становится completed
	useEffect(() => {
		if (isCompleted && progress !== EnumTaskProgress.completed) {
			setValue('progress', EnumTaskProgress.completed)
		}
		if (!isCompleted && progress === EnumTaskProgress.completed) {
			setValue('progress', EnumTaskProgress.not_started)
		}
	}, [isCompleted])

	useTaskDebounce({ watch, itemId: item.id })

	const { deleteTask, isDeletePending } = useDeleteTask()

	return (
		<div
			className={cn(
				styles.row,
				isCompleted ? styles.completed : '',
				'animation-opacity'
			)}
		>
			<div>
				<span className='inline-flex items-center gap-2.5 w-full'>
					<button aria-describedby='todo-item'>
						<GripVertical className={styles.grip} />
					</button>

					<Controller
						control={control}
						name='isCompleted'
						render={({ field: { value, onChange } }) => (
							<Checkbox
								onChange={onChange}
								checked={value}
							/>
						)}
					/>

					<TransparentField {...register('name')} />
				</span>
			</div>
			<div>
				<Controller
					control={control}
					name='createdAt'
					render={({ field: { value, onChange } }) => (
						<DatePicker
							onChange={onChange}
							value={value || ''}
						/>
					)}
				/>
			</div>
			<div className='capitalize'>
				<Controller
					control={control}
					name='priority'
					render={({ field: { value, onChange } }) => (
						<SingleSelect
							data={['high', 'medium', 'low'].map(item => ({
								value: item,
								label: item
							}))}
							onChange={onChange}
							value={value || ''}
						/>
					)}
				/>
			</div>
			<div className='flex gap-4'>
				<Controller
					control={control}
					name='progress'
					render={({ field: { value, onChange } }) => (
						<SingleSelect
							data={[
								EnumTaskProgress.not_started,
								EnumTaskProgress.in_progress,
								EnumTaskProgress.completed
							].map(item => ({
								value: item,
								label: item.replace('_', ' ')
							}))}
							onChange={onChange}
							value={value || ''}
						/>
					)}
				/>

				<button
					onClick={() =>
						item.id
							? deleteTask(item.id)
							: setItems(prev =>
									prev
										? prev.slice(0, -1)
										: prev
							  )
					}
					className='opacity-50 transition-opacity hover:opacity-100 '
				>
					{isDeletePending ? <Loader size={15} /> : <Trash size={15} />}
				</button>
			</div>
		</div>
	)
}
