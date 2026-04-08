<script setup>
            
import { useAuthStore } from '~/stores/auth';
            
    const auth = useAuthStore()
            
    const logout = () => {
        auth.logout()
        navigateTo('/login')
    }
</script>
<template>
    <header class="h-16 bg-white border-b flex item-center justify-between px-6">
        <div class="p-5">
            Dashboard
        </div>
        <div class="p-5">
            {{ auth.user?.name }} ({{ auth.user?.role }})
        </div>

        <div class="p-5">
            <button @click="logout">Logout</button>
        </div>
    </header>
</template>
