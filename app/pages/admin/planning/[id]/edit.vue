<script setup lang="ts">
import { reactive, onMounted,ref, computed } from 'vue';
import { useUsers } from '~/composables/useUsers';
import { navigateTo, useRoute } from '#app';
import { useShifts } from '~/composables/useShifts';
import type { UpdateShiftPayload } from '~/types/shifts';

definePageMeta({
    middleware: ['auth', 'role'],
    role: 'admin'
})

const route = useRoute()
const shiftId = Number(route.params.id)

const { users, loadUsers } = useUsers()

const employeeQuery = ref('')
const selectedEmployeeName = ref('')
const showEmployeeResults = ref(false)

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

    const selectedEmployee = employeeOptions.value.find(
        e => e.id === shift.userId
    )

    if (selectedEmployee) {
        employeeQuery.value = selectedEmployee.name
        selectedEmployeeName.value = selectedEmployee.name
    }

}

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

const initPage = async () => {
    await loadUsers()
    await loadShift()
}

onMounted(() => {
    initPage()
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

        <!-- <div>
          <label class="mb-1 block text-sm font-medium">Employee User ID</label>
          <input
            v-model.number="form.userId"
            type="number"
            min="1"
            class="w-full rounded-lg border px-3 py-2"
          >
        </div> -->

        <div class="relative md:col-span-2">
  <label class="mb-1 block text-sm font-medium">Employee</label>

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