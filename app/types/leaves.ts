export type LeaveStatus = 'pending' | 'approved' | 'rejected'

export interface LeaveRequests {
    id: number
    userId: number
    userName: string
    startDate: string
    endDate: string
    reason: string
    status: LeaveStatus
}