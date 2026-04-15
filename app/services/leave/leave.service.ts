import { dataSource } from "~/config/data-source";
import { leaveMockService } from "./leave.mock";
import type { LeaveService } from "~/types/services";

const leaveApiService: LeaveService = {
    async getAll() {
        throw new Error('Leave API service is not implemented yet')
    },
    async getByUser() {
        throw new Error('Leave API service is not implemented yet')
    },
    async create() {
        throw new Error('Leave API service is not implemented yet')
    },
    async approve() {
        throw new Error('Leave API service is not implemented yet')
    },
    async reject() {
        throw new Error('Leave API service is not implemented yet')
    },
}

export const leaveService: LeaveService = dataSource === 'mock' ? leaveMockService : leaveApiService