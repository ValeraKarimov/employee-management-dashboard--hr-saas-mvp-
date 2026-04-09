<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, navigateTo } from '#app';
import { useAuthStore } from '~/stores/auth';
            
const route = useRoute()
const auth = useAuthStore()
            
const currentUser = computed(() => auth.user)

const pageTitle = computed(() => {
    switch (route.path) {
        case '/dashboard':
            return 'Dashboard'
        case '/leave':
            return 'My Leave'
        case '/leave/create':
            return 'Create Leave Request'
        case '/admin/users':
            return 'Users'
        case '/admin/leave':
            return 'Leave Requests'
        default: 
            if (route.path.startsWith('/admin/users')) {
                return 'Edit User'
            }

            return 'HRM System'
    }
})

const pageSubtitle = computed(() => {
    if (currentUser.value?.role === 'admin') {
        return 'Admin Panel'
    }

    if (currentUser.value?.role === 'employee') {
        return 'Employee Panel'
    }

    return 'Workspace'
})

const roleClasses = computed(() => {
    return currentUser.value?.role === 'admin'
        ? 'bg-purple-100 text-purple-700'
        : 'bg-blue-100 text-blue-700'
})

// const logout = () => {
//     auth.logout()
//     navigateTo('/login')
// }

const handleLogout = async() => {
    auth.logout()
    await navigateTo('/login')
}

</script>
<template>
    <header class="flex item-center justify-between bg-white border-b px-6 py-4">
        <!-- <div class="p-5">
            Dashboard
        </div>
        <div class="p-5">
            {{ auth.user?.name }} ({{ auth.user?.role }})
        </div>

        <div class="p-5">
            <button @click="handleLogout">Logout</button>
        </div> -->

        <div>
            <h1 class="text-xl font-bold">{{ pageTitle }}</h1>
            <p class="text-sm text-gray-500">{{ pageSubtitle }}</p>
        </div>

        <div class="flex items-center gap-3">
            <div class="text-right">
                <p class="text-sm font-medium text-gray-500">
                    {{ currentUser?.name || 'Guest' }}
                </p>
                <p class="text-xs text-gray-500">
                   email
                </p>
            </div>

            <span 
                class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                :class="roleClasses"
            >
                {{ currentUser?.role || 'guest' }}
            </span>

            <button 
                class="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                @click="handleLogout"
            >
                Logout
            </button>

        </div>

    </header>
</template>
