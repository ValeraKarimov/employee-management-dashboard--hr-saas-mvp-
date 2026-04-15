<script setup lang="ts">
import { ref } from 'vue';
import { navigateTo, useRoute, createError } from '#app';
import UserForm from '~/components/users/UserForm.vue';
import { useUsers } from '~/composables/useUsers';
import type { User } from '~/types/user';

definePageMeta({
    middleware: ['auth','role'],
    role: 'admin'
})

const route = useRoute()
const { getUserById, updateUser } = useUsers()

const userId = Number(route.params.id)

const user = ref<User | null>(null)

onMounted(async () => {
  user.value = await getUserById(userId)

  if(!user.value) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }
})

const handleSubmit = async (payload: Omit<User, 'id'>) => {
  updateUser(userId, payload)
  navigateTo('/admin/users')
}

const handleCancel = () => {
  navigateTo('/admin/users')
}
</script>

<template>
  <div class="max-w-2xl space-y-6">
    <div>
      <h1 class="text-2xl font-bold">Edit User</h1>
      <p class="text-sm text-gray-500">Update employee or admin data</p>
    </div>

    <UserForm 
      :initial-data="user || {}"
      submit-label="Update user"
      @submit="handleSubmit"
      @cancel="handleCancel"  
    />

  </div>
</template>