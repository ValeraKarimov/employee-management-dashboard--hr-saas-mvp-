import type { CreateShiftPayload, Shift, UpdateShiftPayload } from "~/types/shifts";


const shiftDb: Shift[] = [
    {
        id: 1,
        userId: 1,
        date: '2026-04-24',
        startTime: '09:00',
        endTime: '15:00',
        city: 'Roosendaal',
        position: 'Outbound / Conveyer',
        company: 'Getto N.V.',
        scheduleStatus: 'pending',
        hoursApprovalStatus: 'pending'
    },
    {
        id: 2,
        userId: 2,
        date: '2026-04-25',
        startTime: '08:00',
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
        date: '2026-04-25',
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

export const createShiftMock = async (
    payload: CreateShiftPayload
): Promise<Shift> => {
    const nextId = shiftDb.length > 0
    ? Math.max(...shiftDb.map(shift => shift.id)) + 1
    : 1

    const newShift: Shift = {
        id: nextId,
        ...payload
    }

    shiftDb.push(newShift)

    console.log(newShift)

    return newShift
}

export const getShiftByIdMock = async (id: number): Promise<Shift | null> => {
    const shift = shiftDb.find(s => s.id === id)

    return shift ? { ...shift } : null
}

export const updateShiftMock = async (
    id: number,
    payload: UpdateShiftPayload
): Promise<Shift> => {
    const index = shiftDb.findIndex(s => s.id === id)

    if (index === -1) {
        throw new Error("Shift not found");
    }

    const updatedShift: Shift = {
        ...shiftDb[index],
        ...payload,
        id
    }

    shiftDb[index] = updatedShift

    return { ...updatedShift }
}

export const deleteShiftMock = async (id: number): Promise<void> => {
    const index = shiftDb.findIndex(s => s.id === id)

    if (index === -1) {
        throw new Error("Shift not found");
    }

    shiftDb.splice(index, 1)
}

export const confirmShiftMock = async (id: number): Promise<Shift> => {
    const index = shiftDb.findIndex(s => s.id === id)

    if (index === -1) {
        throw new Error("Shift not found");
    }

    const currentDocument = shiftDb[index]

    if (!currentDocument) {
        throw new Error('Shift not found')
    }

    const updatedShift: Shift = {
        ...currentDocument,
        scheduleStatus: 'confirmed'
    }

    // const updatedShift: Shift = {
    //     ...shiftDb[index],
    //     scheduleStatus: 'confirmed'
    // }

    shiftDb[index] = updatedShift

    return { ...updatedShift }
}

export const approveShiftHoursMock = async (id: Number): Promise<Shift> => {
    const index = shiftDb.findIndex(s => s.id === id)

    if (index === -1) {
        throw new Error("Shift not found");
    }

    const currentDoc = shiftDb[index]

    if (!currentDoc) {
        throw new Error("Shift not found");
        
    }

    const updatedShift: Shift = {
        ...currentDoc,
        hoursApprovalStatus: 'approved'
    }

    // const updatedShift: Shift = {
    //     ...shiftDb[index],
    //     hoursApprovalStatus: 'approved'
    // }

    shiftDb[index] = updatedShift

    return { ...updatedShift }

}