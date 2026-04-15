import { dataSource } from "~/config/data-source";
import { leaveMockService } from "./leave.mock";
import { leaveApiService } from "./leave.api";
import type { LeaveService } from "~/types/services";

export const leaveService: LeaveService = dataSource === 'mock' ? leaveMockService : leaveApiService