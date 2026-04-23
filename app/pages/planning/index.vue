<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useShifts } from '~/composables/useShifts'
import { useAuthStore } from '~/stores/auth'
import { useUsers } from '~/composables/useUsers'
import type { Shift, ScheduleStatus } from '~/types/shifts'
import { ui } from '~/constants/ui'

definePageMeta({
  middleware: ['auth']
})

const { users, loadUsers } = useUsers()
const authStore = useAuthStore()
const { shifts, loading, loadShifts, confirmExistingShift, submitting, approveExistingShiftHours } = useShifts()

const searchQuery = ref('')
const statusFilter = ref<'all' | ScheduleStatus>('all')


const currentUser = computed(() => authStore.user)

const isAdmin = computed(() => currentUser.value?.role === 'admin')
const isEmployee = computed(() => currentUser.value?.role === 'employee')

const currentWeekDate = ref(new Date())

const goToPreviousWeek = () => {
  const newDate = new Date(currentWeekDate.value)
  newDate.setDate(newDate.getDate() - 7)
  currentWeekDate.value = newDate
}

const goToNextWeek = () => {
  const newDate = new Date(currentWeekDate.value)
  newDate.setDate(newDate.getDate() + 7)
  currentWeekDate.value = newDate
}

const filteredShifts = computed(() => {
  return weeklyShifts.value.filter(shift => {
    const matchesSearch =
      searchQuery.value === '' ||
      getEmployeeName(shift.userId).toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      shift.city.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      shift.company.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus =
      statusFilter.value === 'all' ||
      shift.scheduleStatus === statusFilter.value

    return matchesSearch && matchesStatus
  })
})

const visibleShifts = computed<Shift[]>(() => {
  if (!currentUser.value) {
    return []
  }

  if (currentUser.value.role === 'admin') {
    return shifts.value
  }

  return shifts.value.filter(shift => shift.userId === currentUser.value?.id)
})

const groupedShifts = computed<Record<string, Shift[]>>(() => {
  const grouped = filteredShifts.value.reduce((acc, shift) => {
    if (!acc[shift.date]) {
      acc[shift.date] = []
    }

    acc[shift.date]?.push(shift)
    return acc
  }, {} as Record<string, Shift[]>)

  // sort inside of day
  Object.keys(grouped).forEach(date => {
    grouped[date]?.sort((a, b) => {
      return a.startTime.localeCompare(b.startTime)
    })
  })

  return grouped
})

const sortedDates = computed(() => {
  return Object.keys(groupedShifts.value).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime()
  })
})

const handleConfirmShift = async (shiftId: number) => {
    await confirmExistingShift(shiftId)
    await loadShifts()
}

const handleApproveHours = async (shiftId: number) => {
    await approveExistingShiftHours(shiftId)
    await loadShifts()
}

const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(new Date(date))
}

const goToCurrentWeek = () => {
  currentWeekDate.value = new Date()
}

const getStartOfWeek = (date: Date) => {
  const d = new Date(date)
  const day = d.getDay() || 7 // Sunday = 0 → 7
  d.setDate(d.getDate() - day + 1)
  d.setHours(0, 0, 0, 0)
  console.log('getStartOfWeek: ', d)
  return d
}

const getEndOfWeek = (date: Date) => {
  const start = getStartOfWeek(date)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)
    console.log('getEndOfWeek: ', end)

  return end
}

const weeklyShifts = computed(() => {

    const start = getStartOfWeek(currentWeekDate.value)
    const end = getEndOfWeek(currentWeekDate.value)

  return visibleShifts.value.filter(shift => {
    const shiftDate = new Date(shift.date)
      console.log('weeklyShifts: ', shiftDate >= start && shiftDate <= end)

    return shiftDate >= start && shiftDate <= end
  })
})

const formatWeekRange = (date: Date) => {
  const start = getStartOfWeek(date)
  const end = getEndOfWeek(date)

  const formatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

  return `${formatter.format(start)} - ${formatter.format(end)}`
}

const scheduleStatusClasses = (status: Shift['scheduleStatus']) => {
  return status === 'confirmed'
    ? 'bg-green-100 text-green-700'
    : 'bg-yellow-100 text-yellow-700'
}

const hoursApprovalStatusClasses = (status: Shift['hoursApprovalStatus']) => {
  return status === 'approved'
    ? 'bg-blue-100 text-blue-700'
    : 'bg-gray-100 text-gray-700'
}

const getEmployeeName = (userId: number) => {
  const user = users.value.find(user => user.id === userId)
  return user?.name ?? `User #${userId}`
}

onMounted(() => {
  loadShifts()
  loadUsers()
})
</script>

<template>
<div :class="ui.page.wrapper">
 <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  <div>
    <h1 :class="ui.page.title">Planning Overview</h1>
    <p :class="ui.page.description">
      {{ formatWeekRange(currentWeekDate) }}
    </p>
  </div>

  <div class="flex flex-wrap gap-2">

          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by employee, city, company..."
            class="rounded-lg border px-3 py-2 text-sm"
          >

          <select
            v-model="statusFilter"
            class="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
          </select>

          <button
            class="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            @click="searchQuery = ''; statusFilter = 'all'"
          >
            Reset
          </button>

        <button
          class="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          @click="goToCurrentWeek"
        >
          Current week
        </button>

        <button
            class="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            @click="goToPreviousWeek"
            >
            Prev week
        </button>

        <button
            class="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            @click="goToNextWeek"
            >
            Next week
        </button>

        <NuxtLink
            v-if="isAdmin"
            to="/admin/planning/create"
            class="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
            Create shift
        </NuxtLink>
    </div>
</div>

    <div v-if="loading" class="rounded-lg border bg-white p-4">
      Loading shifts...
    </div>

    <div
    v-else-if="sortedDates.length === 0"
    class="rounded-lg border bg-white p-6 text-center shadow-sm"
    >
    <h2 class="text-lg font-semibold">No shifts for this week</h2>
    <p class="mt-1 text-sm text-gray-500">
        There are no shifts in the selected week.
    </p>

    <div v-if="isAdmin" class="mt-4">
        <NuxtLink
        to="/admin/planning/create"
        class="inline-flex rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
        Create first shift
        </NuxtLink>
    </div>
    </div>

    <div v-else class="space-y-6">
      <section
        v-for="date in sortedDates"
        :key="date"
        class="rounded-lg border bg-white p-4 shadow-sm"
      >
        <h2 class="mb-4 text-lg font-semibold">
          {{ formatDate(date) }}
        </h2>

        <div class="space-y-3">
          <div
            v-for="shift in groupedShifts[date]"
            :key="shift.id"
            class="rounded-lg border p-4"
          >
            <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p class="text-base font-semibold">
                  {{ shift.startTime }} - {{ shift.endTime }}
                </p>

                  <p
                    v-if="isAdmin"
                    class="text-sm font-medium text-gray-700"
                  >
                    Employee: {{ getEmployeeName(shift.userId) }}
                  </p>

                <p :class="ui.page.description">
                  {{ shift.city }} · {{ shift.position }}
                </p>
              </div>

              <div class="flex flex-wrap gap-2">
                <span
                  class="rounded-full px-3 py-1 text-xs font-medium"
                  :class="scheduleStatusClasses(shift.scheduleStatus)"
                >
                  Schedule: {{ shift.scheduleStatus }}
                </span>

                <span
                  class="rounded-full px-3 py-1 text-xs font-medium"
                  :class="hoursApprovalStatusClasses(shift.hoursApprovalStatus)"
                >
                  Hours: {{ shift.hoursApprovalStatus }}
                </span>

                <button
                    v-if="isEmployee && shift.scheduleStatus === 'pending'"
                    type="button"
                    class="rounded-lg border px-3 py-1 text-xs font-medium bg-black text-white  hover:bg-gray-50 hover:text-black"
                    :disabled="submitting"
                    @click="handleConfirmShift(shift.id)"
                    >
                    {{ submitting ? 'Confirming...' : 'Confirm shift' }}
                </button>

                <button
                    v-if="isAdmin && shift.hoursApprovalStatus === 'pending'"
                    type="button"
                    class="rounded-lg border px-3 py-1 text-xs font-medium bg-black text-white hover:bg-gray-50 hover:text-black"
                    :disabled="submitting"
                    @click="handleApproveHours(shift.id)"
                >
                    {{ submitting ? 'Approving...' : 'Approve hours' }}
                </button>

                <NuxtLink
                    v-if="isAdmin"
                    :to="`/admin/planning/${shift.id}/edit`"
                    class="rounded-lg border px-3 py-1 text-xs font-medium hover:bg-gray-50"
                    >
                    Edit
                </NuxtLink>


              </div>
            </div>

            <div class="grid gap-2 text-sm md:grid-cols-2">
              <p><span class="font-medium">Company:</span> {{ shift.company }}</p>
              <p><span class="font-medium">City:</span> {{ shift.city }}</p>
              <p><span class="font-medium">Position:</span> {{ shift.position }}</p>
              <p><span class="font-medium">Time:</span> {{ shift.startTime }} - {{ shift.endTime }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>