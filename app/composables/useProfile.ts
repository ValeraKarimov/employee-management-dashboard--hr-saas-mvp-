import { ref } from "vue";
import type { Profile, UpdateProfilePayload } from "~/types/profile";
import { getMyProfile, updateMyProfile } from "~/services/profile/profile.service";

export const useProfile = () => {
    const profile = ref<Profile | null>(null)
    const loading = ref(false)
    const saving = ref(false)

    const loadMyProfile = async (userId: number) => {
        loading.value = true

        try {
            profile.value = await getMyProfile(userId)

        } finally {
            loading.value = false
        }
    }

    const updateProfile = async (
        userId: number,
        payload: UpdateProfilePayload
    ) => {
        saving.value = true

        try {
            const updatedProfile = await updateMyProfile(userId, payload)

            if (updatedProfile) {
                profile.value = updatedProfile
            }

            return updatedProfile
        } finally {
            saving.value = false
        }

    }

    return {
        profile,
        loading,
        saving,
        loadMyProfile,
        updateProfile
    }
}