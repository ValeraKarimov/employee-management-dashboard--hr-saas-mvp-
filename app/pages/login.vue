<template>
    <div class="flex flex-col gap-4 items-center justify-center h-screen">

        <button @click="loginAs('employee')">
            Login as Employee
        </button>

        <button @click="loginAs('admin')">
            Login as Admin
        </button>
        <!-- <button @click="login">
            Login (Mock)
        </button> -->
    </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';

    const auth = useAuthStore()

    const loginAs = (role) => {
        auth.login({ 
            name: 'Test User',
            role
        })

        navigateTo('/dashboard')
    }

    definePageMeta({
        layout:'blank',
        // middleware: 'auth'
    })
</script>