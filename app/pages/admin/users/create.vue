<script setup lang="ts">
import { reactive } from 'vue';
import { navigateTo } from '#app';
import { useUsers } from '~/composables/useUsers';
import type { UserRole, User } from '~/types/user';

definePageMeta({
  middleware: ['auth', 'role'],
  role: 'admin'
})

const { createUser } = useUsers()

const form: Omit<User, 'id'> = reactive({
  name: '',
  email: '',
  role: 'employee' as UserRole,
  department: '',
  position: '',
  status: 'active' as 'active' | 'inactive'
})

const handleSubmit = () => {
  createUser({
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
      <h1 class="text-2xl font-bold">Create User</h1>
      <p class="text-sm text-gray-500">Add a new employee or admin</p>
    </div>

    <form 
      class="space-y-4 rounded-xl border bg-white p-6 shadow-sm"
      @submit.prevent="handleSubmit"
    >
    
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
      <select v-model="form.role" class="w-full rounded-lg border px-3 py-2">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
      </select>
    </div>

    <div class="flex-gap-3">
      <button class="rounded-lg lg-black px-4 py-2 text-white">
        Save
      </button>

      <NuxtLink to="/admin/users" class="rounded-lg lg-black px-4 py-2 text-white">
        Save
      </NuxtLink>
    </div>

  </form>
  </div>

</template>