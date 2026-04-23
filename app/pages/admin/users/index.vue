<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUsers } from '~/composables/useUsers';
import type { User } from '~/types/user';
import { ui } from '~/constants/ui';

definePageMeta({
  middleware: ['auth', 'role'],
  role: 'admin'
})

const { users, removeUser, loadUsers } = useUsers()

const search = ref('')
const isLoading = ref(true)

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

const hasUsers = computed(() => users.value.length > 0)
const hasFilteredUsers = computed(() => filteredUsers.value.length > 0)
const isSearching = computed(() => search.value.trim().length > 0)

const handleDelete = (user: User) => {
  const confirmed = window.confirm(`Delete user "${user.name}"?`)
  if (!confirmed) return

  removeUser(user.id)
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

onMounted(async () => {
  try {
    await loadUsers()
  } finally {
    isLoading.value = false
  }
})

</script>

<template>

<div :class="ui.page.wrapper">
  <div :class="ui.page.header">
    <div>
      <h1 :class="ui.page.title">Users</h1>
      <p :class="ui.page.description">Manage employeers and admins</p>
    </div>

      <NuxtLink
        to="/admin/users/create"
        :class="ui.button.primary"
      >
        Create user
      </NuxtLink>


  </div>

  <div :class="ui.input.wrapper">
    <input 
      v-model="search"
      type="text" 
      placeholder="Search by name, email, role, department..."
      :class="ui.input.base"
      >
  </div>

  <div
    v-if="isLoading"
    :class="ui.emptyState.base"
  >
    <h2 :class="ui.emptyState.title">Loading users...</h2>
    <p :class="ui.emptyState.text">
      Please wait while the users list is loading.
    </p>
  </div>

  <div
    v-else-if="!hasUsers" 
    :class="ui.emptyState.base"
    >
    <h2 :class="ui.emptyState.title">No users yet</h2>
    <p :class="ui.emptyState.text">
      Create your first user to get started.
    </p>


    <div :class="ui.emptyState.actions">

      <NuxtLink
        to="/admin/users/create"
        :class="ui.button.primary"
      >
        Create user
      </NuxtLink>

    </div>


  </div>


    <div
    v-else-if="isSearching && !hasFilteredUsers" 
    :class="ui.emptyState.base"
    >
    <h2 :class="ui.emptyState.title">No users found</h2>
    <p :class="ui.emptyState.text">
      Try another search query.
    </p>

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
        <td :class="ui.table.td">{{ user.name }}</td>
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

          <div :class="ui.actions.row">
            <NuxtLink
              :to="`/admin/users/${user.id}`"
              :class="ui.button.secondary"
            >
            Details
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