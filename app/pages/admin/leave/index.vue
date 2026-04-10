<script setup lang="ts">
import { ref, computed } from 'vue';
import { useLeave } from '~/composables/useLeave';
import type { LeaveStatus, LeaveRequests } from '~/types/leaves';
import { ui } from '~/constants/ui';

definePageMeta({
    middleware: ['auth', 'role'],
    role: 'admin'
})

const { leaveRequests, updateLeaveStatus } = useLeave()

const statusFilter = ref<'all' | LeaveStatus>('all')

const filteredRequests = computed(() => {
    if (statusFilter.value === 'all') {
        return leaveRequests.value
    }

    return leaveRequests.value.filter(r => r.status === statusFilter.value)

})

const handleApprove = (request: LeaveRequests) => {
    updateLeaveStatus(request.id, 'approved')
}

const handleReject = (request: LeaveRequests) => {
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

</script>

<template>
    <div class="space-y-6">
        
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold">LeaveRequests</h1>
                <p class="text-sm text-gray-500">
                    Review and manage employee leave requests
                </p>
            </div>
        </div>

        <div class="rounded-xl border bg-white p-4 shadow-sm">
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
            v-if="filteredRequests.length === 0"
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
                        v-for="request in filteredRequests"
                        :key="request.id"
                        class="border-t"
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
                        <div class="flex gap-2">
                            <button 
                                class="rounded-md border px-3 py-1 text-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                :disabled="request.status !== 'pending'"
                                @click="handleApprove(request)"
                            >
                                Approve
                            </button>

                            <button 
                                class="rounded-md border px-3 py-1 text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
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