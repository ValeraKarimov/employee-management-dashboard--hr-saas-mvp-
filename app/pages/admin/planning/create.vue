<script setup lang="ts">
import { reactive } from 'vue';
import { navigateTo } from '#app';
import { useShifts } from '~/composables/useShifts';
import type { CreateShiftPayload } from '~/types/shifts';

definePageMeta({
    middleware: ['auth', 'role'],
    role: 'admin'
})

const { createNewShift, submitting } = useShifts()

const form = reactive<CreateShiftPayload>({
    userId: 2,
    date: '',
    startTime: '',
    endTime: '',
    city: '',
    position: '',
    company: '',
    scheduleStatus: 'pending',
    hoursApprovalStatus: 'pending'
})

const handleSubmit = async () => {
    await createNewShift({
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

</script>
<template>
    <div class="mx-auto max-w-3xl space-y-6">
        
        <div>
            <h1 class="text-2xl font-semibold">Create Shift</h1>
            <p class="text-sm text-gray-500">Create a new shift for an employee</p>
        </div>

        <form class="rounded-lg border bg-white p-6 shadow-sm" @submit.prevent="handleSubmit">
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
            placeholder="Roosendaal, etc."
          >
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium">Position</label>
          <input
            v-model="form.position"
            type="text"
            class="w-full rounded-lg border px-3 py-2"
            placeholder="Outbound / Conveyer, etc."
          >
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium">Company</label>
          <input
            v-model="form.company"
            type="text"
            class="w-full rounded-lg border px-3 py-2"
            placeholder="Some company N.V. etc."
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
          {{ submitting ? 'Creating...' : 'Create shift' }}
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