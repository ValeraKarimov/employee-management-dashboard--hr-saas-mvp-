<script setup>
import { useAuthStore } from '~/stores/auth';

const auth = useAuthStore()
</script>

<template>
    <aside class="w-64 bg-white border-r">
        <div class="p-4 font-bold text-lg">
            HRM
        </div>

        <nav class="flex flex-col gap-2 p-4">
            <NuxtLink to="/dashboard">Dashboard</NuxtLink>
            <NuxtLink to="/profile">Profile</NuxtLink>
            <NuxtLink to="/documents">Documents</NuxtLink>
            <NuxtLink to="/leave">Leave</NuxtLink>
        </nav>
    </aside>
</template>