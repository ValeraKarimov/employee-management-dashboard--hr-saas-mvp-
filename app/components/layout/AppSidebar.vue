<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from '#app';
import { useAuthStore } from '~/stores/auth';
import type { UserRole } from '~/types/user';

const route = useRoute()
const auth = useAuthStore()

interface NavItem {
    label: string
    to: string
    roles: UserRole[]
    exact?: boolean
}

const navigation: NavItem[] = [
    { label: 'Dashboard', to: '/dashboard', roles: ['admin', 'employee'], exact: true },
    { label: 'Profile', to: '/profile', roles: ['admin', 'employee'], exact: true },
    { label: 'Documents List', to: '/documents', roles: ['admin', 'employee'], exact: true },
    { label: 'Add Document', to: '/documents/create', roles: ['employee'], exact: true },
    { label: 'Users', to: '/admin/users', roles: ['admin'] },
    { label: 'Leave Requests', to: '/admin/leave', roles: ['admin'], exact: true },
    { label: 'My Leave', to: '/leave', roles: ['employee'], exact: true },
    { label: 'Create New Request', to: '/leave/create', roles: ['employee'], exact: true },
    { label: 'Planning list', to: '/planning', roles: ['employee', 'admin'], exact: true },
    { label: 'Add to Planning', to: '/admin/planning/create', roles: ['admin'], exact: true },
]

const currentRole = computed(() => auth.user?.role)

const filteredNavigation = computed(() => {
    if(!currentRole) return []

    return navigation.filter(i => i.roles.includes(currentRole.value as UserRole))
})

// const isActiveRoute = (path: string) => {
//     if (path === '/dashboard') {
//         return route.path === '/dashboard'
//     }

//     if (path === '/leave') {
//         return route.path === '/leave'
//     }

//     if (path === '/leave/create') {
//         return route.path === '/leave/create'
//     }

//     return route.path.startsWith(path)
// }

const isActiveRoute = (item: NavItem) => {
    if (item.exact) {
        return route.path === item.to
    }

    return route.path.startsWith(item.to)
}

</script>

<template>

    <!-- <aside class="w-64 bg-white border-r">
        <div class="p-4 font-bold text-lg">
            HRM
        </div>

        <nav class="flex flex-col gap-2 p-4">
            <NuxtLink to="/dashboard">Dashboard</NuxtLink>
            <NuxtLink to="/profile">Profile</NuxtLink>
            <NuxtLink to="/documents">Documents</NuxtLink>
            
            <NuxtLink v-if="auth.user?.role === 'admin'" to='/admin/users'>
                Users
            </NuxtLink>
            
            <NuxtLink v-if="auth.user?.role === 'admin'" to="/admin/leave">
                Leave Requests
            </NuxtLink>

            <NuxtLink v-if="auth.user?.role === 'employee'" to="/leave/">
                My Leave
            </NuxtLink>

            <NuxtLink v-if="auth.user?.role === 'employee'" to="/leave/create">
                Request Leave
            </NuxtLink>

        </nav>
    </aside> -->

    <aside class="flex h-full w-64 flex-col border-r bg--white">
        <div class="border-b px-6 py-4">
            <h2 class="text-lg font-bold">HRM System</h2>
            <p class="text-sm text-gray-500">
                {{ currentRole || 'Guest' }}
            </p>
        </div>

        <nav class="flex-1 space-y-2 p-4">
            <NuxtLink
                v-for="item in filteredNavigation"
                :key="item.to"
                :to="item.to"
                class="block rounded-lg px-4 py-2 text-sm font-medium transition"
                :class="isActiveRoute(item) 
                    ? 'bg-black text-white' 
                    : 'text-gray-700 hover:bg-gray-100'"
            >
                {{ item.label }}
            </NuxtLink>
        </nav>

    </aside>


</template>