import type { Profile, UpdateProfilePayload } from "~/types/profile";

const profiles: Profile[] = [
    {
        id: 1,
        userId: 1,
        phone: '+31 7 20637463',
        address: 'Amsterdam, Netherlands',
        birthDate: '1995-10-12',
        position: 'Frontend Developer',
        department: 'Engineering'
    },
    {
        id: 2,
        userId: 2,
        phone: '+31 7 76249561',
        address: 'Rotterdam, Netherlands',
        birthDate: '1996-08-24',
        position: 'HR Assistant',
        department: 'Human Resources'
    }
]


export const getMyProfileMock = async (userId: number): Promise<Profile | null> => {
    const profile = profiles.find(profile => profile.userId === userId)
    return profile ?? null
}

export const getProfileMock = async (): Promise<Profile[]> => {
    return [...profiles]
}

export const updateMyProfileMock = async (
    userId: number,
    payload: UpdateProfilePayload,
): Promise<Profile | null> => {
    
    const profileIndex = profiles.findIndex(p => p.userId === userId)

    if (profileIndex === -1) {
        return null
    }

    const currentProfile = profiles[profileIndex]

    if (!currentProfile) {return null}

    const updatedProfile: Profile = {
        ...currentProfile,
        ...payload
    }

    // profiles[profileIndex] = {
    //     ...profiles[profileIndex],
    //     ...payload
    // }

    profiles[profileIndex] = updatedProfile

    return updatedProfile
}