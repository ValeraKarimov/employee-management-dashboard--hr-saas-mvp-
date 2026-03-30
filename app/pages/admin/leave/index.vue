<script setup>
import { useLeave } from '~/composables/useLeave';

const { leaveRequests, approve, reject } = useLeave()

definePageMeta({
    middleware: ['auth', 'role'],
    role: 'admin'
})
</script>

<template>
    <div>
        <h1 class="text-2xl font-bold mb-4">Leave Requests</h1>

        <table class="w-full bg-white border">

            <thead>
                <tr class="border-b">
                    <th class="p-2">Name</th>
                    <th class="p-2">Dates</th>
                    <th class="p-2">Status</th>
                    <th class="p-2">Actions</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="leave in leaveRequests" :key="leave.id" class="border-b">
                    <td class="p-2">{{ leave.name }}</td>
                    <td class="p-2">{{ leave.start }} -> {{ leave.end }}</td>
                    <td class="p-2">
                        <span class="px-2 py-1 text-xs rounded bg-gray-100">
                            {{ leave.status }}
                        </span>
                    </td>

                    <td class="p-2 space-x-2">
                        <button @click="approve(leave.id)">Approve</button>
                        <button @click="reject(leave.id)">Reject</button>
                    </td>

                </tr>
            </tbody>

        </table>
    </div>
</template>