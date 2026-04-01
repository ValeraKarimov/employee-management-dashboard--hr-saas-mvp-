<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { navigateTo, useRoute, createError } from '#app';
import { useUsers } from '~/composables/useUsers';
import type { UserRole, User } from '~/types/user';

definePageMeta({
    middleware: ['auth','role'],
    role: 'admin'
})

const route = useRoute()
const { getUserById, updateUser } = useUsers()

const userId = Number(route.params.id)

const form: Omit<User, 'id'> = reactive({
  name:'',
  email:'',
  role:'employee' as UserRole,
  department:'',
  position:'',
  status:'active' as 'active' | 'inactive'
})

onMounted(() => {
  const user = getUserById(userId)

  if(!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  form.name = user.name
  form.email = user.email
  form.role = user.role
  form.department = user.department || ''
  form.position = user.position || ''
  form.status = user.status

})

const handleSubmit = () => {
  updateUser(userId, {
    name: form.name,
    email: form.email,
    role: form.role,
    department: form.department,
    position: form.position,
    status: form.status
  })

  navigateTo('/admin/users')
}

</script>

<template>
  <div class="max-w-2xl space-y-6">
    <div>
      <h1 class="text-2xl font-bold">Edit User</h1>
      <p class="text-sm text-gray-500">Update employee or admin data</p>
    </div>
      <form class="space-y-4 rounded-xl border bg-white p-6 shadow-sm" @submit.prevent="handleSubmit">
      <div>
        <label class="mb-1 block text-sm font-medium">Name</label>
        <input v-model="form.name" type="text" class="w-full rounded-lg border px-3 py-2" />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium">Email</label>
        <input v-model="form.email" type="email" class="w-full rounded-lg border px-3 py-2" />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium">Role</label>
        <select v-model="form.role" class="w-full rounded-lg border px-3 py-2">
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium">Department</label>
        <input v-model="form.department" type="text" class="w-full rounded-lg border px-3 py-2" />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium">Position</label>
        <input v-model="form.position" type="text" class="w-full rounded-lg border px-3 py-2" />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium">Status</label>
        <select v-model="form.status" class="w-full rounded-lg border px-3 py-2">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div class="flex gap-3">
        <button type="submit" class="rounded-lg bg-black px-4 py-2 text-white">
          Update
        </button>

        <NuxtLink to="/admin/users" class="rounded-lg border px-4 py-2">
          Cancel
        </NuxtLink>
      </div>
    </form>
  </div>
</template>