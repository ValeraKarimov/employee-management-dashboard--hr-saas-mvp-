import { createShiftMock, getShiftMock, getShiftByIdMock, updateShiftMock, deleteShiftMock } from "./shifts.mock";
import type { CreateShiftPayload, Shift, UpdateShiftPayload } from "~/types/shifts";

export const getShifts = async(): Promise<Shift[]> => {
    return getShiftMock()
}

export const getShiftById = async(id: number): Promise<Shift | null> => {
    return getShiftByIdMock(id)
}

export const createShift = async (
    payload: CreateShiftPayload
): Promise<Shift> => {
    return createShiftMock(payload)
}

export const updateShift = async (
    id: number,
    payload: UpdateShiftPayload
): Promise<Shift> => {
    return updateShiftMock(id, payload)
}

export const deleteShift = async (id: number): Promise<void> => {
    return deleteShiftMock(id)
}
