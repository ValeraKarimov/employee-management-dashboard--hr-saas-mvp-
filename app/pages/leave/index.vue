<script setup>
import { useLeave } from '~/composables/useLeave';
import { useAuthStore } from '~/stores/auth';

const auth = useAuthStore()
const { leaveRequests } = useLeave()

const myLeaves = computed(() => {
    leaveRequests.value.filter(l => l.userId === auth.user?.id)
})

definePageMeta({
    middleware: ['auth', 'role'],
    role: 'employee'
})
</script>

<template>
    <div>
        
        <div>
            <h1 class="text-2xl font-bold mb-4">My Leave</h1>
            
            <NuxtLink to="/leave/create">
                <button>Create Leave</button>
            </NuxtLink>
            
        </div>

        <table class="w-full bg-white border">
            <tr v-for="leave in myLeaves" :key="leave.id" class="border-b">
                <td class="p-2">{{ leave.start }} -> {{ leave.end }}</td>
                <td class="p-2">{{ leave.status }}</td>
            </tr>
        </table>
    </div>
</template>