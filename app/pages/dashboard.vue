<script setup>
import { computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useUsers } from '~/composables/useUsers';
import { useLeave } from '~/composables/useLeave';

definePageMeta({
        layout: 'default',
        middleware: 'auth'
    })

const auth = useAuthStore()
const { users } = useUsers()
const { leaveRequests, getMyLeaveRequests } = useLeave()

const currentUser = computed(() => auth.user)

const isAdmin = computed(() => currentUser?.value.role === 'admin')
const isEmployee = computed(() => currentUser?.value.role === 'employee')

const totalUsers = computed(() => users.value.length)

const totalAdmins = computed(() => {
    return users.value.filter(u => u.role === 'admin').length
})

const totalEmployees = computed(() => {
    return users.value.filter(u => u.role === 'employee').length
})

const pendingLeaveRequests = computed(() => {
    return leaveRequests.value.filter(l => l.status === 'pending').length
})

const myLeaveRequests = computed(() => {
    if(!currentUser.value) return[]
    return getMyLeaveRequests(currentUser.value.id)
})

const myPendingLeaveRequests = computed(() => {
    return myLeaveRequests.value.filter(r => r.status === 'pending').length
})

const myApprovedLeaveRequests = computed(() => {
    return myLeaveRequests.value.filter(r => r.status === 'approved').length
})

</script>

<template>
    <div class="space-y-8">
        <div>
            <h1 class="text-2xl font-bold">
                Welcome, {{ currentUser?.name }}
            </h1>
            <p class="text-sm text-gray-500">
                Here is an overview of your HR dashboard
            </p>
        </div>

        <div
            v-if="isAdmin"
            class="space-y-8"
        >

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            <div class="rounded-xl border bg-white p-5 shadow-sm">
                <p class="text-sm text-gray-500">Total Users</p>
                <p class="mt-2 text-3xl font-bold">{{ totalUsers }}</p>
            </div>

            <div class="rounded-xl border bg-white p-5 shadow-sm">
                <p class="text-sm text-gray-500">Admins</p>
                <p class="mt-2 text-3xl font-bold">{{ totalAdmins }}</p>
            </div>

            <div class="rounded-xl border bg-white p-5 shadow-sm">
                <p class="text-sm text-gray-500">Employees</p>
                <p class="mt-2 text-3xl font-bold">{{ totalEmployees }}</p>
            </div>

            <div class="rounded-xl border bg-white p-5 shadow-sm">
                <p class="text-sm text-gray-500">Pending leave requests</p>
                <p class="mt-2 text-3xl font-bold">{{ pendingLeaveRequests }}</p>
            </div>
        </div>

            <div class="grid gap-4 md:grid-cols-2">
                <div class="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 class="text-lg font-semibold">Users management</h2>
                    <p class="mt-2 text-sm text-gray-500">
                        Create, edit and manage employees and admins.
                    </p>

                    <div class="mt-4">
                        <NuxtLink
                            to="/admin/users"
                            class="inline-text rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
                        >
                            Manage Users
                        </NuxtLink>
                    </div>
                </div>

                <div class="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 class="text-lg font-semibold">Leave requests</h2>
                    <p class="mt-2 text-sm text-gray-500">
                        Renew pending requests and update requests statuses.
                    </p>

                    <div class="mt-4">
                        <NuxtLink
                            to="/admin/leave"
                            class="inline-text rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
                        >
                            Review leave requests
                        </NuxtLink>
                    </div>
                </div>

            </div>

        </div>

        <div
            v-else-if="isEmployee" 
            class="space-y-8"
        >
            <div class="grid gap-4 md:grid-cols-3">

                <div class="rounded-xl border bg-white p-5 shadow-sm">
                    <p class="text-sm text-gray-500">My leave requests</p>
                    <p class="mt-2 text-3xl font-semibold">{{ myLeaveRequests.length }}</p>
                </div>
                <div class="rounded-xl border bg-white p-5 shadow-sm">
                    <p class="text-sm text-gray-500">Pending requests</p>
                    <p class="mt-2 text-3xl font-semibold">{{ myPendingLeaveRequests }}</p>
                </div>
                <div class="rounded-xl border bg-white p-5 shadow-sm">
                    <p class="text-sm text-gray-500">Approved requests</p>
                    <p class="mt-2 text-3xl font-semibold">{{ myApprovedLeaveRequests }}</p>
                </div>

            </div>

            <div class="grid gap-4 md:grid-cols-2">
                <div class="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 class="text-lg font-semibold">My leave requests</h2>
                    <p class="mt-2 text-sm text-gray-500">
                        Check the status of your submitted leave requests.
                    </p>

                    <div class="mt-4">
                        <NuxtLink
                            to="/leave"
                            class="inline-flex rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
                        >
                            View my leave
                        </NuxtLink>
                    </div>

                </div>


                <div class="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 class="text-lg font-semibold">Create new request</h2>
                    <p class="mt-2 text-sm text-gray-500">
                        Submit a new leave request for review.
                    </p>

                    <div class="mt-4">
                        <NuxtLink
                            to="/leave/create"
                            class="inline-flex rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
                        >
                            Create request
                        </NuxtLink>
                    </div>

                </div>

            </div>

        </div>


    </div>
</template>