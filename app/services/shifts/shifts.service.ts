import { getShiftMock } from "./shifts.mock";
import type { Shift } from "~/types/shifts";

export const getShifts = async(): Promise<Shift[]> => {
    return getShiftMock()
}