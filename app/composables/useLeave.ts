import { ref } from "vue";
import type { LeaveRequests, LeaveStatus } from "~/types/leaves";

const leaveRequests = ref<LeaveRequests[]>([
    {
        id: 1,
        userId: 1,
        userName: 'John One',
        startDate: '2026-04-01',
        endDate: '2026-04-05',
        reason: 'Family Trip',
        status: 'rejected'
    },
    {
        id: 2,
        userId: 2,
        userName: 'Jane Two',
        startDate: '2026-04-10',
        endDate: '2026-04-12',
        reason: 'Medical Appointment',
        status: 'approved'
    },
    {
        id: 3,
        userId: 3,
        userName: 'Mike Three',
        startDate: '2026-05-01',
        endDate: '2025-05-05',
        reason: 'Personal',
        status: 'pending'
    },
    {
        id: 4,
        userId: 1,
        userName: 'John One',
        startDate: '2026-06-24',
        endDate: '2026-07-06',
        reason: 'Special Weekend',
        status: 'pending'
    }
])

export const useLeave = () => {
    const allLeaveRequests = computed(() => leaveRequests.value)

    // const getMyLeaveRequests = (userId: number) => {
    //     return computed(() => {
    //         leaveRequests.value.filter(u => u.userId === userId)
    //     })
    // }

    const getMyLeaveRequests = (userId: number) => {
        return leaveRequests.value.filter((request) => request.userId === userId)
    }


    // const createLeaveRequest = (payload: Omit<LeaveRequests, 'id' | 'status'>) => {
    //     leaveRequests.value.push({
    //         id: Date.now(),
    //         ...payload,
    //         status: 'pending'
    //     })
    // }

    const createLeaveRequest = (payload: Omit<LeaveRequests, 'id' | 'status'>) => {
        const newRequest: LeaveRequests = {
            id: Date.now(),
            ...payload,
            status: 'pending'
        }

        leaveRequests.value.push(newRequest)
        return newRequest
    }

    const updateLeaveStatus = (id: number, status: LeaveStatus) => {

        const request = leaveRequests.value.find(i => i.id === id)

        if (!request) return null
        if (request.status !== 'pending') return null

        request.status = status
        return request

    }

    return {
        leaveRequests: allLeaveRequests,
        getMyLeaveRequests,
        createLeaveRequest,
        updateLeaveStatus
    }
}