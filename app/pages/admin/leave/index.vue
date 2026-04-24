<script setup lang="ts">
import { ref, computed } from 'vue';
import { useLeave } from '~/composables/useLeave';
import type { LeaveStatus, LeaveRequest } from '~/types/leaves';
import { ui } from '~/constants/ui';
import type { LeaveTableRow } from '~/types/leaves';
import { users } from '~/services/users/users.mock';

definePageMeta({
   
    middleware: ['auth', 'role'],
    role: 'admin'
})

const { leaveRequests, updateLeaveStatus } = useLeave()

const statusFilter = ref<'all' | LeaveStatus>('all')

const handleApprove = (request: LeaveRequest) => {
    updateLeaveStatus(request.id, 'approved')
}

const handleReject = (request: LeaveRequest) => {
    updateLeaveStatus(request.id, 'rejected')
}

const getStatusClasses = (status: LeaveStatus) => {
    if (status === 'approved') {
        return ui.badge.leaveApproved
    }

    if (status === 'rejected') {
        return ui.badge.leaveRejected
    }

    return ui.badge.leavePending
}

const leaveRows = computed<LeaveTableRow[]>(() => {

    const filtered = statusFilter.value === 'all'
        ? leaveRequests.value
        : leaveRequests.value.filter(r => r.status === statusFilter.value)

    return filtered.map((l) => {
        const user = users.find(user => user.id === l.userId)

        return {
            ...l,
            userName: user?.name ?? 'UNKNOWN USER',
        }
    })
})

</script>

<template>
    <div :class="ui.page.wrapper">
        
        <div :class="ui.page.header">
            <div>
                <h1 :class="ui.page.title">Leave Requests</h1>
                <p :class="ui.page.description">
                    Review and manage employee leave requests
                </p>
            </div>
        </div>

        <div :class="ui.input.wrapper">
            <div class="flex items-center gap-3">
                <label class="text-sm font-medium">Filter by status:</label>

                <select 
                    v-model="statusFilter"
                    :class="ui.input.base"
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>
        </div>

        <div 
            v-if="leaveRows.length === 0"
            :class="ui.emptyState.base"
        >
            <h2 :class="ui.emptyState.title">No leave requests found</h2>
            <p :class="ui.emptyState.text">
                There are no requests for selected status.
            </p>
        </div>

        <div v-else :class="ui.table.wrapper">
            <table :class="ui.table.table">
                <thead :class="ui.table.thead">
                    <tr>
                        <th :class="ui.table.th">Employee</th>
                        <th :class="ui.table.th">Start Date</th>
                        <th :class="ui.table.th">End Date</th>
                        <th :class="ui.table.th">Reason</th>
                        <th :class="ui.table.th">Status</th>
                        <th :class="ui.table.th">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <tr 
                        v-for="request in leaveRows"
                        :key="request.id"
                        :class="ui.table.row"
                    >
                    <td :class="ui.table.td">{{ request.userName }}</td>
                    <td :class="ui.table.td">{{ request.startDate }}</td>
                    <td :class="ui.table.td">{{ request.endDate }}</td>
                    <td :class="ui.table.td">{{ request.reason }}</td>
                    <td :class="ui.table.td">
                        <span 
                            :class="[ui.badge.base, getStatusClasses(request.status)]"
                        >
                            {{ request.status }}
                        </span>
                    </td>
                    <td :class="ui.table.td">
                        <div :class="ui.actions.row">
                            <button 
                                :class="ui.button.secondary"
                                :disabled="request.status !== 'pending'"
                                @click="handleApprove(request)"
                            >
                                Approve
                            </button>

                            <button 
                                :class="ui.button.danger"
                                :disabled="request.status !== 'pending'"
                                @click="handleReject(request)"
                            >
                                Reject
                            </button>

                        </div>
                    </td>

                    </tr>
                </tbody>

            </table>
        </div>

    </div>
</template>