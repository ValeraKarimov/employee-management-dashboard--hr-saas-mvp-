import type { CreateUserPayload, UpdateUserPayload, User } from '~/types/user'
import { usersService } from '~/services/users/users.service'

const users = ref<User[]>([])

export const useUsers = () => {
    
    const allUsers = users
    
    const loadUsers = async () => {
        users.value = await usersService.getAll()
    }
    
    onMounted(async () => {
        await loadUsers()
    })

    const getUserById = async (id: number) => {
        return await usersService.getById(id)
    }

    const createUser = async (payload: CreateUserPayload) => {
        await usersService.create(payload)
        await loadUsers()
    }

    const updateUser = async (id: number, payload: UpdateUserPayload) => {
        await usersService.update(id, payload)
        await loadUsers()
    }

    const removeUser = async (id: number) => {
        await usersService.remove(id)
        await loadUsers()
    }

    return {
        users: allUsers,
        loadUsers,
        getUserById,
        createUser,
        updateUser,
        removeUser
    }
}