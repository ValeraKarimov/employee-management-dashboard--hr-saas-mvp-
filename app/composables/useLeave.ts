import type { CreateLeavePayload, LeaveRequest, LeaveStatus } from "~/types/leaves";
import { leaveService } from "~/services/leave/leave.service";


const leaveRequests = ref<LeaveRequest[]>([])

export const useLeave = () => {

    
    const allLeaveRequests = computed(() => leaveRequests.value)
    
    // const getMyLeaveRequests = (userId: number) => {
    //     return computed(() => {
        //         leaveRequests.value.filter(u => u.userId === userId)
        //     })
        // }
        
    // const getMyLeaveRequests = (userId: number) => {
    //     return leaveRequests.value.filter((request) => request.userId === userId)
    // }
            
    const loadLeaves = async () => {
        leaveRequests.value = await leaveService.getAll()
    }
    
    onMounted(async () => {
        await loadLeaves()
    })
    
    const loadMyLeaves = async (userId: number) => {
        leaveRequests.value = await leaveService.getByUser(userId)
    }



    // const createLeaveRequest = (payload: Omit<LeaveRequests, 'id' | 'status'>) => {
    //     leaveRequests.value.push({
    //         id: Date.now(),
    //         ...payload,
    //         status: 'pending'
    //     })
    // }

    // const createLeaveRequest = (payload: Omit<LeaveRequest, 'id' | 'status'>) => {
    //     const newRequest: LeaveRequest = {
    //         id: Date.now(),
    //         ...payload,
    //         status: 'pending'
    //     }

    //     leaveRequests.value.push(newRequest)
    //     return newRequest
    // }

    const createLeave = async (payload: CreateLeavePayload) => {
        await leaveService.create(payload)
        await loadMyLeaves(payload.userId)
    }

    // const updateLeaveStatus = (id: number, status: LeaveStatus) => {

    //     const request = leaveRequests.value.find(i => i.id === id)

    //     if (!request) return null
    //     if (request.status !== 'pending') return null

    //     request.status = status
    //     return request

    // }

    const updateLeaveStatus = async (id: number, status: LeaveStatus) => {
        if (status === 'approved') {
            await leaveService.approve(id)
        } else {
            await leaveService.reject(id)
        }

        await loadLeaves()
    }

    return {
        leaveRequests: allLeaveRequests,
        // getMyLeaveRequests,
        loadLeaves,
        loadMyLeaves,
        createLeave,
        updateLeaveStatus
    }
}