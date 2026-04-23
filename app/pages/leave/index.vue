<script setup lang="ts">

import { computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useLeave } from '~/composables/useLeave';
import type { LeaveStatus } from '~/types/leaves';
import { ui } from '~/constants/ui';

definePageMeta({
    middleware: ['auth', 'role'],
    role: 'employee'
})

const auth = useAuthStore();
const { leaveRequests, loadMyLeaves } = useLeave()

const currentUser = computed(() => auth.user)

onMounted(() => {
    if (currentUser.value) {
        loadMyLeaves(currentUser.value.id)
    }
})

const myLeaveRequests = computed(() => leaveRequests.value)

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
    <div :class="ui.page.wrapper">
        <div :class="ui.page.header">
            <div>
                <h1 :class="ui.page.title">My Leave Requests</h1>
                <p :class="ui.page.description">
                    Review and manage employee leave requests
                </p>
            </div>

            <NuxtLink
                to="/leave/create"
                :class="ui.button.primary"
            >
            Create Request
            </NuxtLink>
        </div>

        <div
            v-if="myLeaveRequests.length === 0" 
            :class="ui.emptyState.base"
        >
        <h2 :class="ui.emptyState.title">No leave requests yet</h2>
        <p :class="ui.emptyState.text">You are not submitted any leave requests.</p>

        <NuxtLink
            to="/leave/create"
            :class="ui.button.primary"
        >
            Create your first request
        </NuxtLink>

        </div>

        <div v-else :class="ui.table.wrapper">
            <table :class="ui.table.table">
                <thead :class="ui.table.thead">
                    <tr>
                        <th :class="ui.table.th">Start Date</th>
                        <th :class="ui.table.th">End Date</th>
                        <th :class="ui.table.th">Reason</th>
                        <th :class="ui.table.th">Status</th>
                    </tr>
                </thead>

                <tbody>
                    <tr 
                        v-for="request in myLeaveRequests"
                        :key="request.id"
                        :class="ui.table.row"
                    >
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
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
</template>