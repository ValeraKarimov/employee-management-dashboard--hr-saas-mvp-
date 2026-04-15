import { dataSource } from "~/config/data-source";
import { userMockService } from "./users.mock";
import type { UserService } from "~/types/services";

const usersApiService: UserService = {
    async getAll() {
        throw new Error("User API service is not implemented yet");
    },
    async getById() {
        throw new Error("User API service is not implemented yet");
    },
    async create() {
        throw new Error("User API service is not implemented yet");
    },
    async update() {
        throw new Error("User API service is not implemented yet");
    },
    async remove() {
        throw new Error("User API service is not implemented yet");
    },
}

export const usersService: UserService = dataSource === 'mock' ? userMockService : usersApiService