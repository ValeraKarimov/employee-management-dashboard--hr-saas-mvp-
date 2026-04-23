<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useLeave } from '~/composables/useLeave'
import { useShifts } from '~/composables/useShifts'
import { useUsers } from '~/composables/useUsers'
import { useDocuments } from '~/composables/useDocuments'
import { useProfile } from '~/composables/useProfile'
import { useRoute, createError } from '#app'
import { ui } from '~/constants/ui'
import type { User } from '~/types/user'
import type { LeaveRequest } from '~/types/leaves'
import type { Shift } from '~/types/shifts'
import type { DocumentItem } from '~/types/document'
import type { Profile } from '~/types/profile'

definePageMeta({
  middleware: ['auth', 'role'],
  role: 'admin'
})

const route = useRoute()
const { getUserById } = useUsers()
const { loadLeaves, leaveRequests } = useLeave()
const { shifts, loadShifts } = useShifts()
const { documents, loadingAllDocuments } = useDocuments()
const { profiles, loadProfiles } = useProfile()

const userId = Number(route.params.id)
const user = ref<User | null>(null)

onMounted(async () => {
  const found = await getUserById(userId)

  if (!found) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  user.value = found

  await loadLeaves()
  await loadShifts()
  await loadingAllDocuments()
  await loadProfiles()
})

const userLeaves = computed<LeaveRequest[]>(() => {
  return leaveRequests.value.filter(l => l.userId === userId)
})

const userShifts = computed<Shift[]>(() => {
  return shifts.value
    .filter(s => s.userId === userId)
    .sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date)
      }

      return a.startTime.localeCompare(b.startTime)
    })
})

const userDocuments = computed<DocumentItem[]>(() => {
  return documents.value.filter(d => d.userId === userId)
})

const userProfile = computed<Profile | null>(() => {
  return profiles.value.find(p => p.userId === userId) || null
})

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
  <div v-if="user" :class="ui.page.wrapper">

    <!-- Header -->
    <div :class="ui.page.header">
      <div>
        <h1 :class="ui.page.title">{{ user.name }}</h1>
        <p :class="ui.page.description">
          User details
        </p>
      </div>

      <div :class="ui.actions.row">
        <NuxtLink
          to="/admin/users"
          :class="ui.button.secondary"
        >
          Back
        </NuxtLink>

        <NuxtLink
          :to="`/admin/users/${user.id}/edit`"
          :class="ui.button.primary"
        >
          Edit user
        </NuxtLink>
      </div>
    </div>

    <!-- Basic info -->
    <div class="grid gap-4 md:grid-cols-2">

      <div :class="ui.card.detail">
        <h2 :class="ui.section.title">Basic info</h2>

        <div>
          <p :class="ui.details.label">Name</p>
          <p :class="ui.details.value">{{ user.name }}</p>
        </div>

        <div>
          <p :class="ui.details.label">Email</p>
          <p :class="ui.details.value">{{ user.email }}</p>
        </div>

        <div>
          <p :class="ui.details.label">Role</p>
          <span :class="[ui.badge.base, getRoleClasses(user.role)]">
            {{ user.role }}
          </span>
        </div>

        <div>
          <p :class="ui.details.label">Status</p>
          <span :class="[ui.badge.base, getStatusClasses(user.status)]">
            {{ user.status }}
          </span>
        </div>

        <div>
          <p :class="ui.details.label">Department</p>
          <p :class="ui.details.value">{{ user.department || '-' }}</p>
        </div>

        <div>
          <p :class="ui.details.label">Position</p>
          <p :class="ui.details.value">{{ user.position || '-' }}</p>
        </div>
      </div>




      <div :class="ui.card.detail">
  <div class="flex items-center justify-between">
    <h2 :class="ui.section.title">Leave requests</h2>
    <span :class="ui.details.label">
      {{ userLeaves.length }} items
    </span>
  </div>

  <div
    v-if="userLeaves.length === 0"
    :class="ui.details.label"
  >
    No leave requests found for this user.
  </div>

  <div
    v-else
    class="space-y-3"
  >
    <div
      v-for="leave in userLeaves"
      :key="leave.id"
      :class="ui.card.nested"
    >
      <div class="flex items-center justify-between gap-4">
        <div>
          <p :class="ui.details.value">
            {{ leave.startDate }} → {{ leave.endDate }}
          </p>
          <p :class="ui.details.label">
            {{ leave.reason || 'No reason provided' }}
          </p>
        </div>

        <span
          class="inline-flex rounded-full px-2 py-1 text-xs font-medium"
          :class="leave.status === 'approved'
            ? 'bg-green-100 text-green-700'
            : leave.status === 'rejected'
              ? 'bg-red-100 text-red-700'
              : 'bg-yellow-100 text-yellow-700'"
        >
          {{ leave.status }}
        </span>
      </div>
    </div>
  </div>
</div>



<div :class="ui.card.detail">
  <div class="flex items-center justify-between">
    <h2 :class="ui.section.title">Shifts</h2>
    <span :class="ui.details.label">
      {{ userShifts.length }} items
    </span>
  </div>

  <div
    v-if="userShifts.length === 0"
    :class="ui.details.label"
  >
    No shifts found for this user.
  </div>

  <div
    v-else
    class="space-y-3"
  >
    <div
      v-for="shift in userShifts"
      :key="shift.id"
      :class="ui.card.nested"
    >
      <div class="flex items-start justify-between gap-4">
        <div :class="ui.details.item">
          <p :class="ui.details.value">
            {{ shift.date }}
          </p>

          <p class="text-sm text-gray-700">
            {{ shift.startTime }} → {{ shift.endTime }}
          </p>

          <p :class="ui.details.label">
            {{ shift.city || '-' }} — {{ shift.position || '-' }}
          </p>
        </div>

        <span
          class="inline-flex rounded-full px-2 py-1 text-xs font-medium"
          :class="shift.hoursApprovalStatus === 'approved'
            ? 'bg-green-100 text-green-700'
            : shift.scheduleStatus === 'confirmed'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-yellow-100 text-yellow-700'"
        >
          {{ shift.scheduleStatus }}
        </span>
      </div>
    </div>
  </div>
</div>






<div :class="ui.card.detail">
  <div class="flex items-center justify-between">
    <h2 :class="ui.section.title">Documents</h2>
    <span :class="ui.details.label">
      {{ userDocuments.length }} items
    </span>
  </div>

  <div
    v-if="userDocuments.length === 0"
    :class="ui.details.label"
  >
    No documents found for this user.
  </div>

  <div
    v-else
    class="space-y-3"
  >
    <div
      v-for="document in userDocuments"
      :key="document.id"
      :class="ui.card.nested"
    >
      <div class="flex items-start justify-between gap-4">
        <div :class="ui.details.item">
          <p :class="ui.details.value">
            {{ document.name }}
          </p>

          <p :class="ui.details.label">
            {{ document.filename }}
          </p>
        </div>

        <span
          class="inline-flex rounded-full px-2 py-1 text-xs font-medium"
          :class="document.status === 'active'
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-700'"
        >
          {{ document.status }}
        </span>
      </div>
    </div>
  </div>
</div>






<div :class="ui.card.detail">
  <div class="flex items-center justify-between">
    <h2 :class="ui.section.title">Profile</h2>
  </div>

  <div
    v-if="!userProfile"
    :class="ui.details.label"
  >
    No profile found for this user.
  </div>

  <div
    v-else
    class="space-y-4"
  >
    <div>
      <p :class="ui.details.label">Phone</p>
      <p :class="ui.details.value">{{ userProfile.phone || '-' }}</p>
    </div>

    <div>
      <p :class="ui.details.label">Address</p>
      <p :class="ui.details.value">{{ userProfile.address || '-' }}</p>
    </div>

    <div>
      <p :class="ui.details.label">Birth date</p>
      <p :class="ui.details.value">{{ userProfile.birthDate || '-' }}</p>
    </div>
  </div>
</div>





    </div>
  </div>

  <!-- loading -->
  <div v-else :class="ui.emptyState.base">
    <h2 :class="ui.emptyState.title">Loading user details...</h2>
    <p :class="ui.emptyState.text">Please wait while the user data is loading...</p>
  </div>
</template>