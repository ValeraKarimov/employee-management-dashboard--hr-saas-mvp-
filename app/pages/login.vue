
<script setup>
import { useAuthStore } from '~/stores/auth';

    const auth = useAuthStore()

    const loginAs = (role) => {
        auth.login({ 
            id: 1,
            name: 'Test User',
            role
        })

        navigateTo('/dashboard')
    }

    definePageMeta({
        layout:'blank',
    })
</script>

<template>
    <div class="flex flex-col gap-4 items-center justify-center h-screen">

        <button @click="loginAs('employee')">
            Login as Employee
        </button>

        <button @click="loginAs('admin')">
            Login as Admin
        </button>
    </div>
</template>