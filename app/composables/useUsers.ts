import { ref } from "vue"
import type { User } from '~/types/user'


const users = ref<User[]>([
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


export const useUsers = () => {
    const allUsers = users

    const getUserById = (id: number) => {
        return users.value.find(user => user.id === id) || null
    }

    const createUser = (payload: Omit<User, 'id'>) => {
        const newUser: User = {
            id: Date.now(),
            ...payload
        }

        users.value.push(newUser)
        return newUser
    }

    const updateUser = (id:number, payload: Omit<User, 'id'>) => {
        
        const index = users.value.findIndex(user => user.id === id)

        if (index === -1) return null

        users.value[index] = {
            id, 
            ...payload
        }

        return users.value[index]
    }

    const deleteUser = (id: number) => {
        users.value = users.value.filter(user => user.id !== id)
    }

    return {
        users: allUsers,
        getUserById,
        createUser,
        updateUser,
        deleteUser
    }
}