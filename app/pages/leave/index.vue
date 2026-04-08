<script setup lang="ts">

import { computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useLeave } from '~/composables/useLeave';
import type { LeaveStatus } from '~/types/leaves';

definePageMeta({
    middleware: ['auth', 'role'],
    role: 'employee'
})

const auth = useAuthStore();
const { getMyLeaveRequests } = useLeave()

const currentUser = computed(() => auth.user)

const myLeaveRequests = computed(() => {
    if (!currentUser.value) return []
    return getMyLeaveRequests(currentUser.value.id)
})

const getStatusClasses = (status: LeaveStatus) => {
    if (status === 'approved') {
        return 'bg-green-100 text-green-700'
    }

    if (status === 'rejected') {
        return 'bg-red-100 text-red-700'
    }

    return 'bg-yellow-100 text-yellow-700'
}

</script>

<template>
    <div class="space-y6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold">My Leave Requests</h1>
                <p class="text-sm text-gray-500">
                    Review and manage employee leave requests
                </p>
            </div>

            <NuxtLink
                to="/leave/create"
                class="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
            >
            Create Request
            </NuxtLink>
        </div>

        <div
            v-if="myLeaveRequests.length === 0" 
            class="rounded-xl border bg-white p-10 text-center shadow-sm"
        >
        <h2 class="text-lg font-semibold">No leave requests yet</h2>
        <p class="mt-2 text-sm text-gray-500">You are not submitted any leave requests.</p>

        <NuxtLink
            to="/leave/create"
            class="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
        >
            Create your first request
        </NuxtLink>

        </div>

        <div v-else class="overflow-hidden rounded-xl border bg-white shadow-sm">
            <table class="min-w-full text-sm">
                <thead class="bg-gray-50 text-left">
                    <tr>
                        <th class="px-4 py-3">Start Date</th>
                        <th class="px-4 py-3">End Date</th>
                        <th class="px-4 py-3">Reason</th>
                        <th class="px-4 py-3">Status</th>
                    </tr>
                </thead>

                <tbody>
                    <tr 
                        v-for="request in myLeaveRequests"
                        :key="request.id"
                        class="border-t"
                    >
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
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
</template>