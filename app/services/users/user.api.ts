import type { UserService } from "~/types/services";
import type { CreateUserPayload, UpdateUserPayload } from "~/types/user";

export const userApiService: UserService = {
    async getAll() {
        return await $fetch('/api/users')
    },
    async getById(id: number) {
        return await $fetch(`/api/users/${id}`)
    },
    async create(payload: CreateUserPayload) {
        return await $fetch('/api/users', {
            method:'POST',
            body: payload
        })
    },
    async update(id: number, payload: UpdateUserPayload) {
        return await $fetch(`/api/users/${id}`, {
            method: 'PUT',
            body: payload,
        })
    },
    async remove(id: number) {
        await $fetch(`/api/users/${id}`, {
            method: 'DELETE'
        })
    }

}