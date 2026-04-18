export type ScheduleStatus = 'confirmed' | 'pending'
export type HoursApprovalStatus = 'pending' | 'approved'

export interface Shift {
    id: number
    userId: number
    date: string
    startTime: string
    endTime: string
    city: string
    position: string
    company: string
    scheduleStatus: ScheduleStatus
    hoursApprovalStatus: HoursApprovalStatus
}

export type CreateShiftPayload = Omit<Shift, 'id'>
export type UpdateShiftPayload = Omit<Shift, 'id'>