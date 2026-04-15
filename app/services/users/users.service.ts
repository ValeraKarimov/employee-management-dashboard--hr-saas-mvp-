import { dataSource } from "~/config/data-source";
import { userMockService } from "./users.mock";
import { userApiService } from "./user.api";
import type { UserService } from "~/types/services";

export const usersService: UserService = dataSource === 'mock' ? userMockService : userApiService