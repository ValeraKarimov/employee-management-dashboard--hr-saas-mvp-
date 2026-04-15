import type { CreateLeavePayload, LeaveRequest, LeaveStatus } from "~/types/leaves";
import { leaveService } from "~/services/leave/leave.service";


const leaveRequests = ref<LeaveRequest[]>([])

export const useLeave = () => {

    
    const allLeaveRequests = computed(() => leaveRequests.value)
            
    const loadLeaves = async () => {
        leaveRequests.value = await leaveService.getAll()
    }
    
    onMounted(async () => {
        await loadLeaves()
    })
    
    const loadMyLeaves = async (userId: number) => {
        leaveRequests.value = await leaveService.getByUser(userId)
    }


    const createLeave = async (payload: CreateLeavePayload) => {
        await leaveService.create(payload)
        await loadMyLeaves(payload.userId)
    }


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
        loadLeaves,
        loadMyLeaves,
        createLeave,
        updateLeaveStatus
    }
}