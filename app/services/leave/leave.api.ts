import type { LeaveService } from "~/types/services";
import type { CreateLeavePayload } from "~/types/leaves";

export const leaveApiService: LeaveService = {
    async getAll() {
        return await $fetch('/api/leave')
    },
    async getByUser(userId: number) {
        return await $fetch(`/api/leave/user/${userId}`)
    },
    async create(payload: CreateLeavePayload) {
        return await $fetch('/api/leave', {
            method: 'POST',
            body: payload
        })
    },

    async approve(id: number) {
        return await $fetch(`/api/leave/${id}/approve`,{
            method: 'PATCH'
        })
    },

    async reject(id: number) {
        return await $fetch(`/api/leave/${id}/reject`, {
            method: 'PATCH'
        })
    },
}