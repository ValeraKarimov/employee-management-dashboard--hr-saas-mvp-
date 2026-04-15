import type { User, CreateUserPayload, UpdateUserPayload } from "./user";
import type { LeaveRequest, CreateLeavePayload } from "./leaves";

export interface UserService {
    getAll(): Promise<User[]>
    getById(id: number): Promise<User | null>
    create(payload: CreateUserPayload): Promise<User>
    update(id: number, payload: UpdateUserPayload): Promise<User>
    remove(id: number): Promise<void>
}

export interface LeaveService {
    getAll(): Promise<LeaveRequest[]>
    getByUser(userId: number): Promise<LeaveRequest[]>
    create(payload: CreateLeavePayload): Promise<LeaveRequest>
    approve(id: number): Promise<LeaveRequest>
    reject(id: number): Promise<LeaveRequest>
}