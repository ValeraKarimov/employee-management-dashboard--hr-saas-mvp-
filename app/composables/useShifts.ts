import { ref } from "vue";
import { getShifts, createShift, getShiftById, updateShift, deleteShift, confirmShift, approveShiftHours } from "~/services/shifts/shifts.service";
import type { CreateShiftPayload, Shift, UpdateShiftPayload } from "~/types/shifts";

export const useShifts = () => {
    const shifts = ref<Shift[]>([])
    const loading = ref(false)
    const submitting = ref(false)

    const loadShifts = async () => {
        loading.value = true

        try {
            shifts.value = await getShifts()
        } finally {
            loading.value = false
        }
    }

    const loadShiftById = async (id: number) => {
        loading.value = true

        try {
            return await getShiftById(id)
        } finally {
            loading.value = false
        }
    }

    const createNewShift = async (payload: CreateShiftPayload) => {
        submitting.value = true

        try {
            return await createShift(payload)
        } finally {
            submitting.value = false
        }

    }

    const updateExistingShift = async (
        id: number,
        payload: UpdateShiftPayload
    ) => {
        submitting.value = true

        try {
            return await updateShift(id, payload)
        } finally {
            submitting.value = false
        }

    }

    const deleteExistingShift = async (id: number) => {
        submitting.value = true

        try {
            await deleteShift(id)
        } finally {
            submitting.value = false
        }
    }

    const confirmExistingShift = async (id: number) => {
        submitting.value = true

        try {
            return await confirmShift(id)
        } finally {
            submitting.value = false
        }
    }

    const approveExistingShiftHours = async (id: number) => {
        submitting.value = true

        try {
            return await approveShiftHours(id)
        } finally {
            submitting.value = false
        }
    }

    return {
        shifts,
        loading,
        submitting,
        loadShifts,
        createNewShift,
        loadShiftById,
        updateExistingShift,
        deleteExistingShift,
        confirmExistingShift,
        approveExistingShiftHours
    }
}