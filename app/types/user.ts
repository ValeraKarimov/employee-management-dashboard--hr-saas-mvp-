export type UserRole = 'admin' | 'employee'
export type UserStatus = 'active' | 'inactive'

export type User = {
    id: number
    name: string
    email: string
    role: UserRole
    department?: string
    position?: string
    status: UserStatus
}


export interface UserPayload {
    name: string
    email: string
    role: UserRole
    status: UserStatus
}

export type CreateUserPayload = UserPayload
export type UpdateUserPayload = UserPayload