<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUsers } from '~/composables/useUsers';
import type { User } from '~/types/user';
import { ui } from '~/constants/ui';

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
  ? ui.badge.roleAdmin
  : ui.badge.roleEmployee
}

const getStatusClasses = (status: User['status']) => {
  return status === 'active'
    ? ui.badge.statusActive
    : ui.badge.statusInactive
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
      :class="ui.button.primary"
    >
      Create user
    </NuxtLink>
  </div>

  <div class="rounded-xl border bg-white p-4 shadow-sm">
    <input 
      v-model="search"
      type="text" 
      placeholder="Search by name, email, role, department..."
      :class="ui.input.base"
      >
  </div>

  <div
    v-if="filteredUsers.length === 0" 
    :class="ui.emptyState.base"
    >
    <h2 :class="ui.emptyState.title">No users found</h2>
    <p :class="ui.emptyState.text">
      Try another search or create a new user.
    </p>

    <NuxtLink
      to="/admin/users/create"
      :class="ui.button.primary"
    >
      Create user
    </NuxtLink>

  </div>

  <div v-else :class="ui.table.wrapper">
    <table :class="ui.table.table">
      <thead :class="ui.table.thead">
        <tr>
          <th :class="ui.table.th">Name</th>
          <th :class="ui.table.th">Email</th>
          <th :class="ui.table.th">Role</th>
          <th :class="ui.table.th">Status</th>
          <th :class="ui.table.th">Department</th>
          <th :class="ui.table.th">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr 
          v-for="user in filteredUsers"
          :key="user.id"
          :class="ui.table.row"
        >
        <td class="font-medium" :class="ui.table.td">{{ user.name }}</td>
        <td :class="ui.table.td">{{ user.email }}</td>
        <td :class="ui.table.td">
          <span 
            :class="[ui.badge.base, getRoleClasses(user.role)]"
          >
          {{ user.role }}
          </span>
        </td>
        <td :class="ui.table.td">
          <span 
            :class="[ui.badge.base, getStatusClasses(user.status)]"
          >
          {{ user.status }}
          </span>
        </td>
        <td :class="ui.table.td">{{ user.department || '-' }}</td>
        <td :class="ui.table.td">
          <div class="flex gap-2">
            <NuxtLink
              :to="`/admin/users/${user.id}`"
              :class="ui.button.secondary"
            >
            Edit
          </NuxtLink>

          <button 
            :class="ui.button.danger"
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