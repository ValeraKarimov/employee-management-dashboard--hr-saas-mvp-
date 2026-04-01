<template>
  <div v-if="user" class="max-w-xl">
    <h1 class="text-2xl font-bold mb-6">Edit User</h1>

    <form class="bg-white border rounded p-6 space-y-4" @submit.prevent="save">
      <div>
        <label>Name</label>
        <input v-model="form.name" class="border w-full p-2 rounded"/>
      </div>

      <div>
        <label>Email</label>
        <input v-model="form.email" class="border w-full p-2 rounded"/>
      </div>

      <div>
        <label>Role</label>
        <select v-model="form.role" class="border w-full p-2 rounded">
          <option value="employee">employee</option>
          <option value="admin">admin</option>
        </select>
      </div>

      <div class="flex gap-3">
        <button class="bg-black text-white px-4 py-2 rounded">
          Save
        </button>

        <NuxtLink :to="`/admin/users/${user.id}`">
          Cancel
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup>
const route = useRoute()
const { getUser, updateUser } = useUsers()

const id = Number(route.params.id)

const user = getUser(id)

const form = ref({
  name: user?.name || '',
  email: user?.email || '',
  role: user?.role || 'employee'
})

const save = () => {
  updateUser(id, form.value)
  navigateTo(`/admin/users/${id}`)
}

definePageMeta({
  middleware: ['auth', 'role'],
  role: 'admin'
})
</script>