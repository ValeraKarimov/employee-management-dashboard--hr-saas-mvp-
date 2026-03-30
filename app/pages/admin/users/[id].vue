<script setup>
import { useUsers } from '~/composables/useUsers';

const route = useRoute();
const { getUser } = useUsers()

const user = getUser(Number(route.params.id))

definePageMeta({
    middleware: ['auth','role'],
    role: 'admin'
})
</script>

<template>
    <div v-if="user">
        <h1 class="text-2xl font-bold mb-4">#{{ user.id }}</h1>

        <div class="bg-white p-4 border rounded">
            <p><strong>Name:</strong> {{ user.name }}</p>
            <p><strong>Role:</strong> {{ user.role }}</p>
        </div>
    </div>

    <div v-else>
        User not found
    </div>
</template>