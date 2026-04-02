<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUsers } from '~/composables/useUsers';
import type { User } from '~/types/user';

definePageMeta({
  middleware: ['auth', 'role'],
  role: 'admin'
})

const { users, deleteUser } = useUsers()

const search = ref('')

const filteredUsers = computed(() => {
  const query = search.value.toLowerCase().trim()

  if(!query) return users.value

  return users.value.filter((user) => {
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query) ||
      (user.department || '').toLowerCase().includes(query) ||
      (user.position || '').toLowerCase().includes(query)
    )
  })
})

const handleDelete = (user: User) => {
  const comfirmed = window.confirm(`Delete user "${user.name}"?`)
  if (!comfirmed) return

  deleteUser(user.id)
}

const getRoleClasses = (role: User['role']) => {
  return role === 'admin'
  ? 'bg-purple-100 text-purple-700'
  : 'bg-blue-100 text-blue-700'
}

const getStatusClasses = (status: User['status']) => {
  return status === 'active'
    ? 'bg-green-100 text-green-700'
    : 'bg-gray-100 text-gray-700'
}

</script>

<template>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold">Users</h1>
      <p class="text-sm text-gray-500">Manage employeers and admins</p>
    </div>

    <NuxtLink
      to="/admin/users/create"
      class="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
    >
      Create user
    </NuxtLink>
  </div>

  <div class="rounded-xl border bg-white p-4 shadow-sm">
    <input 
      v-model="search"
      type="text" 
      placeholder="Search by name, email, role, department..."
      class="w-full rounded-lg border px-3 py-2 outline-none">
  </div>

  <div
    v-if="filteredUsers.length === 0" 
    class="rounded-xl border bg-white p-10 text-center shadow-sm">
    <h2 class="text-lg font-semibold">No users found</h2>
    <p class="mt-2 text-sm text-gray-500">
      Try another search or create a new user.
    </p>

    <NuxtLink
      to="/admin/users/create"
      class="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
    >
      Create user
    </NuxtLink>

  </div>

  <div v-else class="overflow-hidden rounded-xl border bg-white shadow-sm">
    <table class="min-w-full text-sm">
      <thead class="bg-gray-50 text-left">
        <tr>
          <th class="px-4 py-3">Name</th>
          <th class="px-4 py-3">Email</th>
          <th class="px-4 py-3">Role</th>
          <th class="px-4 py-3">Status</th>
          <th class="px-4 py-3">Department</th>
          <th class="px-4 py-3">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr 
          v-for="user in filteredUsers"
          :key="user.id"
          class="border-t"
        >
        <td class="px-4 py-3 font-medium">{{ user.name }}</td>
        <td class="px-4 py-3">{{ user.email }}</td>
        <td class="px-4 py-3">
          <span 
            class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
            :class="getRoleClasses(user.role)"
          >
          {{ user.role }}
          </span>
        </td>
        <td class="px-4 py-3">
          <span 
            class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
            :class="getStatusClasses(user.status)"
          >
          {{ user.status }}
          </span>
        </td>
        <td class="px-4 py-3">{{ user.department || '-' }}</td>
        <td class="px-4 py-3">
          <div class="flex gap-2">
            <NuxtLink
              :to="`/admin/users/${user.id}`"
              class="rounded-md border px-3 py-1"
            >
            Edit
          </NuxtLink>

          <button 
            class="rounded-md border px-3 py-1 text-red-600"
            @click="handleDelete(user)"
          >Delete</button>

          </div>
        </td>
        </tr>
      </tbody>

    </table>
  </div>

</div>

</template>