<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { navigateTo, useRoute } from '#app';
import { useShifts } from '~/composables/useShifts';
import type { UpdateShiftPayload } from '~/types/shifts';

definePageMeta({
    middleware: ['auth', 'role'],
    role: 'admin'
})

const route = useRoute()
const shiftId = Number(route.params.id)

const { loadShiftById, updateExistingShift, deleteExistingShift, loading, submitting } = useShifts()

const form = reactive<UpdateShiftPayload>({
    userId: 0,
    date: '',
    startTime: '',
    endTime: '',
    city: '',
    position: '',
    company: '',
    scheduleStatus: 'pending',
    hoursApprovalStatus: 'pending'
})

const loadShift = async () => {
    const shift = await loadShiftById(shiftId)

    if (!shift) {
        await navigateTo('/planning')
        return
    }

    form.userId = shift.userId
    form.date = shift.date
    form.startTime = shift.startTime
    form.endTime = shift.endTime
    form.city = shift.city
    form.position = shift.position
    form.company = shift.company
    form.scheduleStatus = shift.scheduleStatus
    form.hoursApprovalStatus = shift.hoursApprovalStatus
}

const handleSubmit = async () => {
    await updateExistingShift(shiftId, {
        userId: Number(form.userId),
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        city: form.city,
        position: form.position,
        company: form.company,
        scheduleStatus: form.scheduleStatus,
        hoursApprovalStatus: form.hoursApprovalStatus
    })

    await navigateTo('/planning')
}

const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this shift?')

    if(!confirmed) return

    await deleteExistingShift(shiftId)
    await navigateTo('/planning')
}

onMounted(() => {
    loadShift()
})

</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <div>
      <h1 class="text-2xl font-semibold">Edit Shift</h1>
      <p class="text-sm text-gray-500">
        Update shift information
      </p>
    </div>

    <div v-if="loading" class="rounded-lg border bg-white p-4">
      Loading shift...
    </div>

    <form
      v-else
      class="rounded-lg border bg-white p-6 shadow-sm"
      @submit.prevent="handleSubmit"
    >
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium">Employee User ID</label>
          <input
            v-model.number="form.userId"
            type="number"
            min="1"
            class="w-full rounded-lg border px-3 py-2"
          >
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium">Date</label>
          <input
            v-model="form.date"
            type="date"
            class="w-full rounded-lg border px-3 py-2"
          >
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium">Start time</label>
          <input
            v-model="form.startTime"
            type="time"
            class="w-full rounded-lg border px-3 py-2"
          >
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium">End time</label>
          <input
            v-model="form.endTime"
            type="time"
            class="w-full rounded-lg border px-3 py-2"
          >
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium">City</label>
          <input
            v-model="form.city"
            type="text"
            class="w-full rounded-lg border px-3 py-2"
          >
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium">Position</label>
          <input
            v-model="form.position"
            type="text"
            class="w-full rounded-lg border px-3 py-2"
          >
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium">Company</label>
          <input
            v-model="form.company"
            type="text"
            class="w-full rounded-lg border px-3 py-2"
          >
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium">Schedule status</label>
          <select
            v-model="form.scheduleStatus"
            class="w-full rounded-lg border px-3 py-2"
          >
            <option value="pending">pending</option>
            <option value="confirmed">confirmed</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium">Hours approval</label>
          <select
            v-model="form.hoursApprovalStatus"
            class="w-full rounded-lg border px-3 py-2"
          >
            <option value="pending">pending</option>
            <option value="approved">approved</option>
          </select>
        </div>
      </div>

      <div class="mt-6 flex gap-3">
        <button
          type="submit"
          class="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          :disabled="submitting"
        >
          {{ submitting ? 'Saving...' : 'Save changes' }}
        </button>

        <button
            type="button"
            class="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            :disabled="submitting"
            @click="handleDelete"
        >
            Delete
        </button>

        <NuxtLink
          to="/planning"
          class="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Cancel
        </NuxtLink>
      </div>
    </form>
  </div>
</template>