<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUsers } from '~/composables/useUsers';
import type { User } from '~/types/user';

definePageMeta({
  middleware: ['auth', 'role'],
  role: 'admin'
})

const { users, deleteUser } = useUsers()

const search = ref('')

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const query = search.value.toLocaleLowerCase()

    return (
      user.name.toLocaleLowerCase().includes(query) ||
      user.email.toLocaleLowerCase().includes(query) ||
      user.role.toLocaleLowerCase().includes(query)
    )
  })
})

const handleDelete = (user: User) => {
  const comfirmed = window.confirm(`Delete User "${user.name}"?`)

  if (!comfirmed) return

  deleteUser(user.id)

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
      >Create user</NuxtLink>
    </div>

    <div class="rounded-xl borde bg-white p-4 shadow-sm">
      <input 
        type="text"
        placeholder="Search by name, email or role" 
        class="w-full rounded-lg border px-3 py-2 outline-none"
        />
    </div>
    
    <div class="overfolow-hidden rounded-xl border bg-white shadow-sm">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 text-left">
          <tr>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Email</th>
            <th class="px-4 py-3">Role</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr 
            v-for="user in filteredUsers"
            :key="user.id"
            class="border-t"
            >
              <td class="px-4 py-3">{{ user.name }}</td>
              <td class="px-4 py-3">{{ user.email }}</td>
              <td class="px-4 py-3">{{ user.role }}</td>
              <td class="px-4 py-3">{{ user.status }}</td>
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
                  >Delete
                </button>

                </div>

              </td>
          </tr>

          <tr v-if="filteredUsers.length === 0">
            <td colspan="5" class="px-4 py-6 text-center text-gray-500">
              No User Found
            </td>
          </tr>

        </tbody>

      </table>
    </div>

  </div>
</template>