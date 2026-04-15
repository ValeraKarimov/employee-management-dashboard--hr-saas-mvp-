import { ref } from "vue";
import type { UserService } from "~/types/services";
import type { User, CreateUserPayload, UpdateUserPayload } from "~/types/user";


export const users = <User[]>([
    { 
        id: 1, 
        name: 'John One', 
        email: 'john@example.com', 
        role: 'admin',
        department: 'Management',
        position: 'HR Admin',
        status: 'active'
    },
    { 
        id: 2, 
        name: 'Jane Two', 
        email: 'jane@example.com', 
        role: 'employee',
        department: 'Marketing',
        position: 'Content Specialist',
        status: 'active'
    },
    { 
        id: 3, 
        name: 'Mike Three', 
        email: 'mike@example.com', 
        role: 'employee',
        department: 'Sales',
        position: 'Sales Manager',
        status: 'inactive'
    }
])

export const userMockService: UserService = {
    async getAll() {
        return [...users]
    },

    async getById(id: number) {
        const user = users.find(u => u.id === id)
        return user ? {...user} : null
    },

    async create(payload: CreateUserPayload) {
        const newUser: User = {
            id: Date.now(),
            ...payload
        }
        users.push(newUser)
        return { ...newUser }
    },

    async update(id: number, payload: UpdateUserPayload) {
        const existingUser = users.find(u => u.id === id)

        if(!existingUser) {
            throw new Error('user not found');
        }

        const updatedUser: User = {
            ...existingUser,
            ...payload
        }

        const index = users.findIndex(u => u.id === id)
        users[index] = updatedUser

        return { ...updatedUser }
    },

    async remove(id: number) {
        const index = users.findIndex(u => u.id === id)

        if (index === -1) {
            throw new Error('User not found')
        }

        users.splice(index, 1)
    },
}