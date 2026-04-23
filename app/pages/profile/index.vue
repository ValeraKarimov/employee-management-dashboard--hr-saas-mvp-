<script setup lang="ts">
import { reactive, watch, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { useProfile } from '~/composables/useProfile'
import type { UpdateProfilePayload } from '~/types/profile'
import { ui } from '~/constants/ui'

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
  <div :class="ui.page.wrapper">
    <div :class="ui.page.header">
      <div>
        <h1 :class="ui.page.title">My Profile</h1>
        <p :class="ui.page.description">Employee personal information</p>
      </div>

      <button
        v-if="profile && !isEditing"
        :class="ui.button.primary"
        @click="startEditing"
      >
        Edit
      </button>
    </div>

    <div v-if="loading" :class="ui.emptyState.base">
      <h2 :class="ui.emptyState.title">Loading profile...</h2>
      <p :class="ui.emptyState.text">Please wait while the profile is loading.</p>
    </div>

    <div v-else-if="profile" :class="ui.card.section">
      <form v-if="isEditing" class="space-y-4" @submit.prevent="handleSubmit">
        <div :class="ui.details.grid">
          <div :class="ui.form.field">
            <label :class="ui.form.label">Phone</label>
            <input
              v-model="form.phone"
              type="text"
              :class="ui.input.base"
            />
          </div>

          <div :class="ui.form.field">
            <label :class="ui.form.label">Address</label>
            <input
              v-model="form.address"
              type="text"
              :class="ui.input.base"
            />
          </div>

          <div :class="ui.form.field">
            <label :class="ui.form.label">Birth date</label>
            <input
              v-model="form.birthDate"
              type="date"
              :class="ui.input.base"
            />
          </div>

          <div :class="ui.form.field">
            <label :class="ui.form.label">Position</label>
            <input
              v-model="form.position"
              type="text"
              :class="ui.input.base"
            />
          </div>

          <div :class="ui.form.field">
            <label :class="ui.form.label">Department</label>
            <input
              v-model="form.department"
              type="text"
              :class="ui.input.base"
            />
          </div>
        </div>

        <div :class="ui.form.actions">
          <button
            type="submit"
            :class="ui.button.primary"
            :disabled="saving"
          >
            {{ saving ? 'Saving...' : 'Save' }}
          </button>

          <button
            type="button"
            :class="ui.button.secondary"
            @click="cancelEditing"
          >
            Cancel
          </button>
        </div>
      </form>

      <div v-else :class="ui.details.grid">
        <div class="space-y-1">
          <p :class="ui.details.label">Phone</p>
          <p :class="ui.details.value">{{ profile.phone }}</p>
        </div>

        <div class="space-y-1">
          <p :class="ui.details.label">Address</p>
          <p :class="ui.details.value">{{ profile.address }}</p>
        </div>

        <div class="space-y-1">
          <p :class="ui.details.label">Birth date</p>
          <p :class="ui.details.value">{{ profile.birthDate }}</p>
        </div>

        <div class="space-y-1">
          <p :class="ui.details.label">Position</p>
          <p :class="ui.details.value">{{ profile.position }}</p>
        </div>

        <div class="space-y-1">
          <p :class="ui.details.label">Department</p>
          <p :class="ui.details.value">{{ profile.department }}</p>
        </div>
      </div>
    </div>

    <div v-else :class="ui.emptyState.base">
      <h2 :class="ui.emptyState.title">
        Profile not found
      </h2>

      <p :class="ui.emptyState.text">
        We could not find profile information for this user.
      </p>

    </div>
  </div>
</template>