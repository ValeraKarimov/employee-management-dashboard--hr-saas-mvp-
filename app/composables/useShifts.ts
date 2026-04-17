import { ref } from "vue";
import { getShifts } from "~/services/shifts/shifts.service";
import type { Shift } from "~/types/shifts";

export const useShifts = () => {
    const shifts = ref<Shift[]>([])
    const loading = ref(false)

    const loadShifts = async () => {
        loading.value = true

        try {
            shifts.value = await getShifts()
        } finally {
            loading.value = false
        }
    }

    return {
        shifts,
        loading,
        loadShifts
    }
}