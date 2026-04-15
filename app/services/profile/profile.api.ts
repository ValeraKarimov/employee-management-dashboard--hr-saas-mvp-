import type { Profile, UpdateProfilePayload } from "~/types/profile";

export const getMyProfileApi = async ( userId: number ): Promise<Profile | null> => {
    console.log('TODO: get profile from API')
    return null
}

export const updateMyProfileApi = async(
    _userId: number,
    _payload: UpdateProfilePayload
): Promise<Profile | null> => {
    console.log('TODO: update profile via API')
    return null
}