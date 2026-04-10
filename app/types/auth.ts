import type { UserRole } from "./user"

export interface AuthUser {
    id: number
    name: string
    role: UserRole
}