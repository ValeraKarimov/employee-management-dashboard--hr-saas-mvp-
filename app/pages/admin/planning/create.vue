<script setup lang="ts">
import { reactive, computed, ref, onMounted } from 'vue';
import { useUsers } from '~/composables/useUsers';
import { navigateTo } from '#app';
import { useShifts } from '~/composables/useShifts';
import type { CreateShiftPayload } from '~/types/shifts';
import { ui } from '~/constants/ui';

definePageMeta({
    middleware: ['auth', 'role'],
    role: 'admin'
})

const { users, loadUsers } = useUsers()

const employeeQuery = ref('')
const selectedEmployeeName = ref('')
const showEmployeeResults = ref(false)

const employeeOptions = computed(() => {
    return users.value.filter(u => u.role === 'employee')
})

const filteredEmployees = computed(() => {
    const query = employeeQuery.value.trim().toLowerCase()

    if (!query) return employeeOptions.value
    
    return employeeOptions.value.filter(e => e.name.toLowerCase().includes(query))
})

const selectEmployee = (employee: { id: number, name: string }) => {
    form.userId = employee.id
    employeeQuery.value = employee.name
    selectedEmployeeName.value = employee.name
    showEmployeeResults.value = false
}

const handleEmployeeInput = () => {
    form.userId = 0
    selectedEmployeeName.value = ''
    showEmployeeResults.value = true
}



const { createNewShift, submitting } = useShifts()

const form = reactive<CreateShiftPayload>({
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

const errors = reactive({
    userId: '',
    date: '',
    startTime: '',
    endTime: '',
    city: '',
    position: '',
    company: ''
})

const resetErrors = () => {
    errors.userId = ''
    errors.date = ''
    errors.startTime = ''
    errors.endTime = ''
    errors.city = ''
    errors.position = ''
    errors.company = ''
}

const validateForm = () => {
  resetErrors()

  if (!form.userId) {
    errors.userId = 'Please select an employee.'
  }

  if (!form.date) {
    errors.date = 'Date is required.'
  }

  if (!form.startTime) {
    errors.startTime = 'Start time is required.'
  }

  if (!form.endTime) {
    errors.endTime = 'End time is required.'
  }

  if (!form.city.trim()) {
    errors.city = 'City is required.'
  }

  if (!form.position.trim()) {
    errors.position = 'Position is required.'
  }

  if (!form.company.trim()) {
    errors.company = 'Company is required.'
  }

  if (
    form.startTime &&
    form.endTime &&
    form.startTime === form.endTime
  ) {
    errors.endTime = 'End time must be different from start time.'
  }

  return !Object.values(errors).some(Boolean)
}

const handleSubmit = async () => {
    if (!validateForm()) return

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

onMounted(() => loadUsers())

</script>
<template>
    <div class="mx-auto max-w-3xl space-y-6">
        
        <div>
            <h1 class="text-2xl font-semibold">Create New Shift</h1>
            <p :class="ui.page.description">Create a new shift for an employee</p>
        </div>

        <form class="rounded-lg border bg-white p-6 shadow-sm" @submit.prevent="handleSubmit">
      <div class="grid gap-4 md:grid-cols-2">
        

        <div class="relative md:col-span-2">
        <label class="mb-1 block text-sm font-medium">Select Employee</label>
        
        <input
        v-model="employeeQuery"
        type="text"
        class="w-full rounded-lg border px-3 py-2"
        placeholder="Search employee by name"
        @input="handleEmployeeInput"
        @focus="showEmployeeResults = true"
        >
        
        <div
            v-if="showEmployeeResults && filteredEmployees.length > 0"
            class="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border bg-white shadow-lg"
        >
            <button
            v-for="employee in filteredEmployees"
            :key="employee.id"
            type="button"
            class="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
            @click="selectEmployee(employee)"
            >
            <span class="font-medium">{{ employee.name }}</span>
            <span class="ml-2 text-gray-500">#{{ employee.id }}</span>
            </button>
        </div>

        <p v-if="selectedEmployeeName" class="mt-2 text-sm text-gray-500">
            Selected employee: {{ selectedEmployeeName }}
        </p>
        <p v-if="errors.userId" class="mt-1 text-sm text-red-600">
            {{ errors.userId }}
        </p>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium">Date</label>
          <input
            v-model="form.date"
            type="date"
            class="w-full rounded-lg border px-3 py-2"
          >
            <p v-if="errors.date" class="mt-1 text-sm text-red-600">
                {{ errors.date }}
            </p>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium">Start time</label>
          <input
            v-model="form.startTime"
            type="time"
            class="w-full rounded-lg border px-3 py-2"
          >
          <p v-if="errors.startTime" class="mt-1 text-sm text-red-600">
            {{ errors.startTime }}
          </p>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium">End time</label>
          <input
            v-model="form.endTime"
            type="time"
            class="w-full rounded-lg border px-3 py-2"
          >
          <p v-if="errors.endTime" class="mt-1 text-sm text-red-600">
            {{ errors.endTime }}
          </p>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium">City</label>
          <input
            v-model="form.city"
            type="text"
            class="w-full rounded-lg border px-3 py-2"
            placeholder="Roosendaal, etc."
          >
          <p v-if="errors.city" class="mt-1 text-sm text-red-600">
            {{ errors.city }}
            </p>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium">Position</label>
          <input
            v-model="form.position"
            type="text"
            class="w-full rounded-lg border px-3 py-2"
            placeholder="Outbound / Conveyer, etc."
          >
          <p v-if="errors.position" class="mt-1 text-sm text-red-600">
            {{ errors.position }}
            </p>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium">Company</label>
          <input
            v-model="form.company"
            type="text"
            class="w-full rounded-lg border px-3 py-2"
            placeholder="Some company N.V. etc."
          >
          <p v-if="errors.company" class="mt-1 text-sm text-red-600">
            {{ errors.company }}
            </p>
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