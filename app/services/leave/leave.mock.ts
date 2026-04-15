import { ref } from "vue";
import type { LeaveService } from "~/types/services";
import type { LeaveRequest, CreateLeavePayload } from "~/types/leaves";

export const leaveRequests = <LeaveRequest[]>([
    {
        id: 1,
        userId: 1,
        startDate: '2026-04-01',
        endDate: '2026-04-05',
        reason: 'Family Trip',
        status: 'rejected'
    },
    {
        id: 2,
        userId: 2,
        startDate: '2026-04-10',
        endDate: '2026-04-12',
        reason: 'Medical Appointment',
        status: 'approved'
    },
    {
        id: 3,
        userId: 3,
        startDate: '2026-05-01',
        endDate: '2025-05-05',
        reason: 'Personal',
        status: 'pending'
    },
    {
        id: 4,
        userId: 1,
        startDate: '2026-06-24',
        endDate: '2026-07-06',
        reason: 'Special Weekend',
        status: 'pending'
    },
])

export const leaveMockService: LeaveService = {
    async getAll() {
        return [...leaveRequests]
    },

    async getByUser(userId: number) {
        return leaveRequests.filter(u => u.userId === userId)
    },

    async create(payload: CreateLeavePayload) {
        const newLeave: LeaveRequest = {
            id: Date.now(),
            ...payload,
            status: 'pending'
        }
        leaveRequests.push(newLeave)

        return { ...newLeave }
    },

    async approve(id: number) {
        const leave = leaveRequests.find(l => l.id === id)

        if(!leave) {
            throw new Error('Leave request not found')
        }

        if(leave.status !== 'pending') {
            throw new Error('Leave request already processed')
        }

        leave.status = 'approved'

        return { ...leave }
    },

    async reject(id: number) {
        const leave = leaveRequests.find(l => l.id === id)

        if(!leave) {
            throw new Error('Leave request not found')
        }

        if(leave.status !== 'pending') {
            throw new Error('Leave request already processed')
        }

        leave.status = 'rejected'

        return { ...leave }
    },
}