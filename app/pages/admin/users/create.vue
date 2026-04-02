<script setup lang="ts">
import { navigateTo } from '#app';
import UserForm from '~/components/users/UserForm.vue';
import { useUsers } from '~/composables/useUsers';
import type { User } from '~/types/user';

definePageMeta({
  middleware: ['auth', 'role'],
  role: 'admin'
})

const { createUser } = useUsers()

const handleSubmit = (payload: Omit<User, 'id'>) => {
  createUser(payload)
  navigateTo('/admin/users')
}

const handleCancel = () => {
  navigateTo('/admin/users')
}

</script>


<template>
  <div class="max-w-2xl space-y-6">
    <div>
      <h1 class="text-2xl font-bold">Create User</h1>
      <p class="text-sm text-gray-500">Add a new employee or admin</p>
    </div>

  <UserForm
    submit-label="Create user"
    @submit="handleSubmit"
    @cancel="handleCancel"  
  />

  </div>

</template>