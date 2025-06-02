'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'
import { toast } from 'sonner'
import { authService } from '@/services/auth.service'
import { Heading } from '@/components/ui/Heading'

interface OtpFormProps {
  email: string
  onSuccess: (accessToken: string) => void
  onCancel: () => void
}

interface IOtpFormInput {
  otpCode: string
}

export function OtpForm({ email, onSuccess, onCancel }: OtpFormProps) {
  const { register, handleSubmit } = useForm<IOtpFormInput>()

  const onSubmit: SubmitHandler<IOtpFormInput> = async (data) => {
    try {
      const res = await authService.verifyOtp({ email, code: data.otpCode })

      const accessToken = res.data.accessToken
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken)
        toast.success('OTP verification successful!')

        onSuccess(accessToken)
      } else {
        toast.error('Invalid OTP or no access token received')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'OTP verification failed')
    }
  }

  return (
    <div className="flex min-h-screen justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-1/4 shadow bg-sidebar rounded-xl p-layout flex flex-col items-center justify-center"
      >
        <div className="mb-6">
          <Heading title="OTP Verification" />
        </div>
<Field
  id="otpCode"
  label="OTP Code:"
  placeholder="Enter OTP"
  extra="mb-6"
  type="text"
  pattern="\d*"         
  maxLength={6}           
  {...register('otpCode', {
    required: 'OTP code is required!',
    pattern: {
      value: /^\d+$/,
      message: 'Только цифры разрешены',
    },
  })}
/>


        <div className="flex flex-col items-center gap-4 w-full">
          <Button type="submit" className="w-full">
            Verify OTP
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
