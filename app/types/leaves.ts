export type LeaveStatus = 'pending' | 'approved' | 'rejected'

export interface LeaveRequest {
    id: number
    userId: number
    startDate: string
    endDate: string
    reason: string
    status: LeaveStatus
}

export interface CreateLeavePayload {
    userId: number
    startDate: string
    endDate: string
    reason: string
}

export type LeaveTableRow = LeaveRequest & {
    userName: string
}