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
  <div v-if="user" class="space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">{{ user.name }}</h1>
        <p class="text-sm text-gray-500">
          User details
        </p>
      </div>

      <div class="flex gap-2">
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

      <div class="rounded-xl border bg-white p-5 shadow-sm space-y-4">
        <h2 class="text-lg font-semibold">Basic info</h2>

        <div>
          <p class="text-sm text-gray-500">Name</p>
          <p class="font-medium">{{ user.name }}</p>
        </div>

        <div>
          <p class="text-sm text-gray-500">Email</p>
          <p class="font-medium">{{ user.email }}</p>
        </div>

        <div>
          <p class="text-sm text-gray-500">Role</p>
          <span :class="[ui.badge.base, getRoleClasses(user.role)]">
            {{ user.role }}
          </span>
        </div>

        <div>
          <p class="text-sm text-gray-500">Status</p>
          <span :class="[ui.badge.base, getStatusClasses(user.status)]">
            {{ user.status }}
          </span>
        </div>

        <div>
          <p class="text-sm text-gray-500">Department</p>
          <p class="font-medium">{{ user.department || '-' }}</p>
        </div>

        <div>
          <p class="text-sm text-gray-500">Position</p>
          <p class="font-medium">{{ user.position || '-' }}</p>
        </div>
      </div>




      <div class="rounded-xl border bg-white p-5 shadow-sm space-y-4">
  <div class="flex items-center justify-between">
    <h2 class="text-lg font-semibold">Leave requests</h2>
    <span class="text-sm text-gray-500">
      {{ userLeaves.length }} items
    </span>
  </div>

  <div
    v-if="userLeaves.length === 0"
    class="text-sm text-gray-500"
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
      class="rounded-lg border p-4"
    >
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="font-medium">
            {{ leave.startDate }} → {{ leave.endDate }}
          </p>
          <p class="text-sm text-gray-500">
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



<div class="rounded-xl border bg-white p-5 shadow-sm space-y-4">
  <div class="flex items-center justify-between">
    <h2 class="text-lg font-semibold">Shifts</h2>
    <span class="text-sm text-gray-500">
      {{ userShifts.length }} items
    </span>
  </div>

  <div
    v-if="userShifts.length === 0"
    class="text-sm text-gray-500"
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
      class="rounded-lg border p-4"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="space-y-1">
          <p class="font-medium">
            {{ shift.date }}
          </p>

          <p class="text-sm text-gray-700">
            {{ shift.startTime }} → {{ shift.endTime }}
          </p>

          <p class="text-sm text-gray-500">
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






<div class="rounded-xl border bg-white p-5 shadow-sm space-y-4">
  <div class="flex items-center justify-between">
    <h2 class="text-lg font-semibold">Documents</h2>
    <span class="text-sm text-gray-500">
      {{ userDocuments.length }} items
    </span>
  </div>

  <div
    v-if="userDocuments.length === 0"
    class="text-sm text-gray-500"
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
      class="rounded-lg border p-4"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="space-y-1">
          <p class="font-medium">
            {{ document.name }}
          </p>

          <p class="text-sm text-gray-500">
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






<div class="rounded-xl border bg-white p-5 shadow-sm space-y-4">
  <div class="flex items-center justify-between">
    <h2 class="text-lg font-semibold">Profile</h2>
  </div>

  <div
    v-if="!userProfile"
    class="text-sm text-gray-500"
  >
    No profile found for this user.
  </div>

  <div
    v-else
    class="space-y-4"
  >
    <div>
      <p class="text-sm text-gray-500">Phone</p>
      <p class="font-medium">{{ userProfile.phone || '-' }}</p>
    </div>

    <div>
      <p class="text-sm text-gray-500">Address</p>
      <p class="font-medium">{{ userProfile.address || '-' }}</p>
    </div>

    <div>
      <p class="text-sm text-gray-500">Birth date</p>
      <p class="font-medium">{{ userProfile.birthDate || '-' }}</p>
    </div>
  </div>
</div>





    </div>
  </div>

  <!-- loading -->
  <div v-else class="text-sm text-gray-500">
    Loading...
  </div>
</template>