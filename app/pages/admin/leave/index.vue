<script setup lang="ts">
import { ref, computed } from 'vue';
import { useLeave } from '~/composables/useLeave';
import type { LeaveStatus, LeaveRequests } from '~/types/leaves';

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
        return 'bg-green-100 text-green-700'
    }

    if (status === 'rejected') {
        return 'bg-red-100 text-red-700'
    }

    return 'bg-yellow-100 text-red-700'
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
                    class="rounded-lg border px-3 py-2 text-sm outline-none"
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
            class="rounded-xl border bg-white p-10 text-center shadow-sm"
        >
            <h2 class="text-lg font-semibold">No leave requests found</h2>
            <p class="mt-2 text-sm text-gray-500">
                There are no requests for selected status.
            </p>
        </div>

        <div v-else class="overflow-hidden rounded-xl border bg-white shadow-sm">
            <table class="min-w-full text-sm">
                <thead class="bg-gray-50 text-left">
                    <tr>
                        <th class="px-4 py-3">Employee</th>
                        <th class="px-4 py-3">Start Date</th>
                        <th class="px-4 py-3">End Date</th>
                        <th class="px-4 py-3">Reason</th>
                        <th class="px-4 py-3">Status</th>
                        <th class="px-4 py-3">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <tr 
                        v-for="request in filteredRequests"
                        :key="request.id"
                        class="border-t"
                    >
                    <td class="px-4 py-3">{{ request.userName }}</td>
                    <td class="px-4 py-3">{{ request.startDate }}</td>
                    <td class="px-4 py-3">{{ request.endDate }}</td>
                    <td class="px-4 py-3">{{ request.reason }}</td>
                    <td class="px-4 py-3">
                        <span 
                            class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                            :class="getStatusClasses(request.status)"
                        >
                            {{ request.status }}
                        </span>
                    </td>
                    <td class="px-4 py-3">
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