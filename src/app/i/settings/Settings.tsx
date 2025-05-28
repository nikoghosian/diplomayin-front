'use client'

import { SubmitHandler, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'

import { TypeUserForm } from '@/types/auth.types'

import { useInitialData } from './useInitialData'
import { useUpdateSettings } from './useUpdateSettings'
import { useDeleteAccount } from './useDeleteAccount'

export function Settings() {
	const { register, handleSubmit, reset } = useForm<TypeUserForm>({
		mode: 'onChange'
	})

	useInitialData(reset)

	const { isPending, mutate } = useUpdateSettings()
const { deleteAccount } = useDeleteAccount()
	const onSubmit: SubmitHandler<TypeUserForm> = data => {
		const { password, ...rest } = data

		mutate({
			...rest,
			password: password || undefined
		})
	}

	return (
		<div>
			<form
				className='w-3/4'
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className='grid grid-cols-2 gap-10 grid-repeat-2'>
					<div>
						<Field
							id='email'
							label='Email: '
							placeholder='Enter email: '
							type='email'
							{...register('email', {
								required: 'Email is required!'
							})}
							extra='mb-5'
						/>

						<Field
							id='name'
							label='Name: '
							placeholder='Enter name: '
							{...register('name')}
							extra='mb-5'
						/>

						<Field
							id='password'
							label='Password: '
							placeholder='Enter password: '
							type='password'
							{...register('password')}
							extra='mb-5'
						/>
					</div>

					<div>
						<Field
							id='workInterval'
							label='Work interval : '
							placeholder='Enter work interval : '
							isNumber
							{...register('workInterval', {
								valueAsNumber: true
							})}
							extra='mb-5'
						/>

						<Field
							id='breakInterval'
							label='Break interval : '
							placeholder='Enter break interval : '
							isNumber
							{...register('breakInterval', {
								valueAsNumber: true
							})}
							extra='mb-5'
						/>

						<Field
							id='intervalsCount'
							label='Intervals count : '
							placeholder='Enter intervals count : '
							isNumber
							{...register('intervalsCount', {
								valueAsNumber: true
							})}
							extra='mb-5'
						/>
					</div>
				</div>

				<Button
					type='submit'
					disabled={isPending}
				>
					Save
				</Button>
				<Button
					type='button'
					className='ml-[245px] hover:bg-red-600 '
					onClick={() => deleteAccount()}
				>
					Delete
				</Button>

			</form>
		</div>
	)
}
