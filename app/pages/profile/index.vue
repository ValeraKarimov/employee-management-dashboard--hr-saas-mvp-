<script setup lang="ts">
import { reactive, watch, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { useProfile } from '~/composables/useProfile'
import type { UpdateProfilePayload } from '~/types/profile'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const { user: currentUser } = storeToRefs(authStore)

const { profile, loading, saving, loadMyProfile, updateProfile } = useProfile()

const isEditing = ref(false)

const form = reactive<UpdateProfilePayload>({
  phone: '',
  address: '',
  birthDate: '',
  position: '',
  department: ''
})

watch(profile, (value) => {
  if (!value) return

  form.phone = value.phone
  form.address = value.address
  form.birthDate = value.birthDate
  form.position = value.position
  form.department = value.department
}, { immediate: true })

onMounted(() => {
  if (currentUser.value) {
    loadMyProfile(currentUser.value.id)
  }
})

const startEditing = () => {
  if (!profile.value) return

  form.phone = profile.value.phone
  form.address = profile.value.address
  form.birthDate = profile.value.birthDate
  form.position = profile.value.position
  form.department = profile.value.department

  isEditing.value = true
}

const cancelEditing = () => {
  if (!profile.value) return

  form.phone = profile.value.phone
  form.address = profile.value.address
  form.birthDate = profile.value.birthDate
  form.position = profile.value.position
  form.department = profile.value.department

  isEditing.value = false
}

const handleSubmit = async () => {
  if (!currentUser.value) return

  const updated = await updateProfile(currentUser.value.id, {
    phone: form.phone,
    address: form.address,
    birthDate: form.birthDate,
    position: form.position,
    department: form.department
  })

  if (updated) {
    isEditing.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">My Profile</h1>
        <p class="text-sm text-gray-500">Employee personal information</p>
      </div>

      <button
        v-if="profile && !isEditing"
        class="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        @click="startEditing"
      >
        Edit
      </button>
    </div>

    <div v-if="loading" class="rounded-lg border p-4">
      Loading profile...
    </div>

    <div v-else-if="profile" class="rounded-lg border bg-white p-6 shadow-sm">
      <form v-if="isEditing" class="space-y-4" @submit.prevent="handleSubmit">
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm text-gray-500">Phone</label>
            <input
              v-model="form.phone"
              type="text"
              class="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm text-gray-500">Address</label>
            <input
              v-model="form.address"
              type="text"
              class="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm text-gray-500">Birth date</label>
            <input
              v-model="form.birthDate"
              type="date"
              class="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm text-gray-500">Position</label>
            <input
              v-model="form.position"
              type="text"
              class="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm text-gray-500">Department</label>
            <input
              v-model="form.department"
              type="text"
              class="w-full rounded-lg border px-3 py-2"
            />
          </div>
        </div>

        <div class="flex gap-3">
          <button
            type="submit"
            class="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            :disabled="saving"
          >
            {{ saving ? 'Saving...' : 'Save' }}
          </button>

          <button
            type="button"
            class="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            @click="cancelEditing"
          >
            Cancel
          </button>
        </div>
      </form>

      <div v-else class="grid gap-4 md:grid-cols-2">
        <div>
          <p class="text-sm text-gray-500">Phone</p>
          <p class="font-medium">{{ profile.phone }}</p>
        </div>

        <div>
          <p class="text-sm text-gray-500">Address</p>
          <p class="font-medium">{{ profile.address }}</p>
        </div>

        <div>
          <p class="text-sm text-gray-500">Birth date</p>
          <p class="font-medium">{{ profile.birthDate }}</p>
        </div>

        <div>
          <p class="text-sm text-gray-500">Position</p>
          <p class="font-medium">{{ profile.position }}</p>
        </div>

        <div>
          <p class="text-sm text-gray-500">Department</p>
          <p class="font-medium">{{ profile.department }}</p>
        </div>
      </div>
    </div>

    <div v-else class="rounded-lg border p-4 text-sm text-gray-500">
      Profile not found
    </div>
  </div>
</template>