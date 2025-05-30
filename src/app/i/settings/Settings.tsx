'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'
import { TypeUserForm } from '@/types/auth.types'
import { useInitialData } from './useInitialData'
import { useUpdateSettings } from './useUpdateSettings'
import { useDeleteAccount } from './useDeleteAccount'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
import { useState } from 'react'

export function Settings() {
  const { register, handleSubmit, reset, formState: { isValid } } = useForm<TypeUserForm>({
    mode: 'onChange'
  })

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  useInitialData(reset)

  const { isPending, mutate } = useUpdateSettings()
  const { deleteAccount, isPending: isDeletePending } = useDeleteAccount()

  const onSubmit: SubmitHandler<TypeUserForm> = data => {
    const { password, ...rest } = data
    mutate({
      ...rest,
      password: password || undefined
    })
  }

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

  const handleConfirmDelete = () => {
    deleteAccount()
    setOpenDeleteDialog(false)
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <form
        className="w-full max-w-2xl bg-black text-white shadow-lg rounded-xl p-8 md:p-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-bold mb-8 text-center">Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column */}
          <div className="space-y-5">
            <Field
              id='email'
              label='Email: '
              placeholder='Enter email: '
              type='email'
              {...register('email', {
                required: 'Email is required!'
              })}
              extra='mb-2'
            />

            <Field
              id='name'
              label='Name: '
              placeholder='Enter name: '
              {...register('name')}
              extra='mb-2'
            />

            <Field
              id='password'
              label='Password: '
              placeholder='Enter password: '
              type='password'
              {...register('password')}
              extra='mb-2'
            />
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            <Field
              id='workInterval'
              label='Work interval: '
              placeholder='Enter work interval: '
              isNumber
              {...register('workInterval', {
                valueAsNumber: true
              })}
              extra='mb-2'
            />

            <Field
              id='breakInterval'
              label='Break interval: '
              placeholder='Enter break interval: '
              isNumber
              {...register('breakInterval', {
                valueAsNumber: true
              })}
              extra='mb-2'
            />

            <Field
              id='intervalsCount'
              label='Intervals count: '
              placeholder='Enter intervals count: '
              isNumber
              {...register('intervalsCount', {
                valueAsNumber: true
              })}
              extra='mb-2'
            />
          </div>
        </div>

        {/* Fixed Buttons Container */}
        <div className="mt-12 w-full">
          <div className="flex flex-col md:flex-row justify-end gap-4">
            <Button
              type='submit'
              disabled={isPending}
              className="bg-gray-900 text-white w-full md:w-auto"
            >
              Save
            </Button>
            <Button
              type='button'
              className='hover:bg-red-600 bg-gray-900 text-white w-full md:w-auto'
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
          </div>
        </div>
      </form>

      {/* MUI Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          style: {
            backgroundColor: '#1a1a1a',
            color: 'white',
            borderRadius: '12px',
            padding: '20px'
          }
        }}
      >
        <DialogTitle className="text-xl font-bold">
          Confirm Account Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="text-gray-300">
            Are you sure you want to permanently delete your account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="gap-3 p-4">
          <Button
            onClick={handleCloseDeleteDialog}
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isDeletePending}
          >
            {isDeletePending ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}