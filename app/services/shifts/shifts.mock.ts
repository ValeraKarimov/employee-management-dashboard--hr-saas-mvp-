import type { Shift } from "~/types/shifts";

const shiftDb: Shift[] = [
    {
        id: 1,
        userId: 1,
        date: '2026-04-18',
        startTime: '06:00',
        endTime: '15:00',
        city: 'Roosendaal',
        position: 'Outbound / Conveyer',
        company: 'Getto N.V.',
        scheduleStatus: 'confirmed',
        hoursApprovalStatus: 'pending'
    },
    {
        id: 2,
        userId: 2,
        date: '2026-04-21',
        startTime: '06:00',
        endTime: '15:00',
        city: 'Roosendaal',
        position: 'Forklift',
        company: 'Andy works N.V.',
        scheduleStatus: 'pending',
        hoursApprovalStatus: 'pending'
    },
    {
        id: 3,
        userId: 3,
        date: '2026-04-22',
        startTime: '06:00',
        endTime: '15:00',
        city: 'Roosendaal',
        position: 'Heftruck',
        company: 'Flex Jobb N.V.',
        scheduleStatus: 'confirmed',
        hoursApprovalStatus: 'pending'
    },
]

export const getShiftMock = async(): Promise<Shift[]> => {
    return [...shiftDb]
}