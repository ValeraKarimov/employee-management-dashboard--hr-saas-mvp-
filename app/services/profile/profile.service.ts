import { getMyProfileMock, updateMyProfileMock, getProfileMock } from "./profile.mock";
import { getMyProfileApi, updateMyProfileApi } from "./profile.api";
import { dataSource } from "~/config/data-source";
import type { Profile, UpdateProfilePayload } from "~/types/profile";

export const getMyProfile = async (userId: number): Promise<Profile | null> => {
    if (dataSource == 'mock') {
        return getMyProfileMock(userId)
    }

    return getMyProfileApi(userId)
}

export const getMyProfiles = async (): Promise<Profile[]> => {
    if (dataSource === 'mock') {
        return getProfileMock()
    }

    // return getProfilesApi()
    return []
}

export const updateMyProfile = async (
    userId: number, 
    payload: UpdateProfilePayload
): Promise<Profile | null> => {
    if(dataSource === 'mock') {
        return updateMyProfileMock(userId, payload)
    }
    return updateMyProfileApi(userId, payload)
}