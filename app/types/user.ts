export type UserRole = 'admin' | 'employee'

export type User = {
    id: number
    name: string
    email: string
    role: UserRole
    department?: string
    position?: string
    status: 'active' | 'inactive'
}