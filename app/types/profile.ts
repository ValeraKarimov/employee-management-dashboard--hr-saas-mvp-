export interface Profile {
    id: number
    userId: number
    phone: string
    address: string
    birthDate: string
    position: string
    department: string
}

export type UpdateProfilePayload = Omit<Profile, 'id' | 'userId'>