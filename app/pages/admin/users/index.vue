<script setup>
import { useUsers } from '~/composables/useUsers';


const { users } = useUsers();

const goToUser = (id) => {
    navigateTo(`/admin/users/${id}`)
}

definePageMeta({
    middleware: ['auth', 'role'],
    role: 'admin'
})
</script>

<template>
    <div>
        <h1 class="text-2xl font-bold mb-4">Users</h1>

        <table class="w-full bg-white border">
            
            <thead>
                <tr class="border-b">
                    <th class="p-2 text-left">ID</th>
                    <th class="p-2 text-left">Name</th>
                    <th class="p-2 text-left">Role</th>
                </tr>
            </thead>

            <tbody>
                <tr
                v-for="user in users"
                :key="user.id"
                class="border-b hover:bg-gray-50 cursor-pointer"
                @click="goToUser(user.id)"
                >
                <td class="p-2">{{ user.id }}</td>
                <td class="p-2">{{ user.name }}</td>
                <td class="p-2">{{ user.role }}</td>
            </tr>
            </tbody>

        </table>
    </div>

</template>