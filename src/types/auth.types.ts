export interface IAuthForm {
	email: string
	password: string
}

export interface IUser {
	id: number
	name?: string
	email: string

	workInterval?: number
	breakInterval?: number
	intervalsCount?: number
}

export interface IOtpForm {
	email: string
	onSuccess: (accessToken: string) => void
	onCancel: () => void
}

export interface IAuthResponse {
	accessToken: string
	user: IUser
	otpRequired?: boolean
	email?: string
}

export type TypeUserForm = Omit<IUser, 'id'> & { password?: string }
