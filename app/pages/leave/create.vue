<script setup>
import { useLeave } from '~/composables/useLeave';
import { useAuthStore } from '~/stores/auth';

const { leaveRequests } = useLeave()
const auth = useAuthStore()

const start = ref('')
const end = ref('')

const create = () => {
    leaveRequests.value.push({
        id: Date.now(),
        userId: auth.user.id,
        name: auth.user.name,
        start: start.value,
        end: end.value,
        status: 'pending'
    })

    navigateTo('/leave')
}

definePageMeta({
    middleware: ['auth', 'role'],
    role: 'employee'
})
</script>


<template>
    <div>
        <h1>Create Leave</h1>

        <input v-model="start" type="date" />
        <input v-model="end" type="date" />

        <button @click="create">Submit</button>
    </div>
</template>