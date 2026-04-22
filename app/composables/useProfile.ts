import { ref } from "vue";
import type { Profile, UpdateProfilePayload } from "~/types/profile";
import { getMyProfile, updateMyProfile, getMyProfiles } from "~/services/profile/profile.service";

export const useProfile = () => {
    const profile = ref<Profile | null>(null)

    const profiles = ref<Profile[]>([])

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

    const loadProfiles = async () => {
        loading.value = true

        try {
            profiles.value = await getMyProfiles()
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
        profiles,
        loading,
        saving,
        loadMyProfile,
        loadProfiles,
        updateProfile
    }
}