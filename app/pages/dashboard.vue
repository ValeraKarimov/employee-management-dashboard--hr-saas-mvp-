<script setup>
import { computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useUsers } from '~/composables/useUsers';
import { useLeave } from '~/composables/useLeave';
import { ui } from '~/constants/ui';

definePageMeta({
        layout: 'default',
        middleware: 'auth'
    })

const auth = useAuthStore()
const { users } = useUsers()
const { leaveRequests, loadMyLeaves } = useLeave()

const currentUser = computed(() => auth.user)

const isAdmin = computed(() => currentUser?.value.role === 'admin')
const isEmployee = computed(() => currentUser?.value.role === 'employee')

const totalUsers = computed(() => users.value.length)

const totalAdmins = computed(() => {
    return users.value.filter(u => u.role === 'admin').length
})

const totalEmployees = computed(() => {
    return users.value.filter(u => u.role === 'employee').length
})

const pendingLeaveRequests = computed(() => {
    return leaveRequests.value.filter(l => l.status === 'pending').length
})

// const myLeaveRequests = computed(() => {
//     if(!currentUser.value) return[]
//     return getMyLeaveRequests(currentUser?.value.id)
// })


// const myLeaveRequests = computed(() => {
//   if(!currentUser.value) return[]
//   return loadMyLeaves(currentUser?.value.id)
// })

const myLeaveRequests = computed(() => leaveRequests.value)

onMounted(() => {
  if(!currentUser.value) {loadMyLeaves(currentUser.value.id)}
})


const myPendingLeaveRequests = computed(() => {
    return myLeaveRequests?.value.filter(r => r.status === 'pending').length
})

const myApprovedLeaveRequests = computed(() => {
    return myLeaveRequests?.value.filter(r => r.status === 'approved').length
})

</script>

<template>
  <div class="space-y-8">
    <section class="space-y-2">
      <h2 :class="ui.emptyState.title">Overview</h2>
      <p class="text-sm text-gray-500">
        A quick summary of your HR workspace.
      </p>
    </section>

    <template v-if="isAdmin">
      <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div :class="ui.card.stat">
          <p class="text-sm text-gray-500">Total users</p>
          <p class="mt-2 text-3xl font-bold">{{ totalUsers }}</p>
        </div>

        <div :class="ui.card.stat">
          <p class="text-sm text-gray-500">Admins</p>
          <p class="mt-2 text-3xl font-bold">{{ totalAdmins }}</p>
        </div>

        <div :class="ui.card.stat">
          <p class="text-sm text-gray-500">Employees</p>
          <p class="mt-2 text-3xl font-bold">{{ totalEmployees }}</p>
        </div>

        <div :class="ui.card.stat">
          <p class="text-sm text-gray-500">Pending leave requests</p>
          <p class="mt-2 text-3xl font-bold">{{ pendingLeaveRequests }}</p>
        </div>
      </section>

      <section class="space-y-4">
        <div>
          <h2 :class="ui.emptyState.title">Quick Actions</h2>
          <p class="text-sm text-gray-500">
            Jump directly to the main admin workflows.
          </p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div :class="ui.card.section">
            <h3 class="text-base font-semibold">Users management</h3>
            <p :class="ui.emptyState.text">
              Create, edit and manage employee and admin accounts.
            </p>

            <div class="mt-4">
              <NuxtLink
                to="/admin/users"
                :class="ui.button.primary"
              >
                Manage users
              </NuxtLink>
            </div>
          </div>

          <div :class="ui.card.section">
            <h3 class="text-base font-semibold">Leave requests</h3>
            <p :class="ui.emptyState.text">
              Review and update employee leave request statuses.
            </p>

            <div class="mt-4">
              <NuxtLink
                to="/admin/leave"
                :class="ui.button.primary"
              >
                Review leave requests
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </template>

    <template v-else-if="isEmployee">
      <section class="grid gap-4 md:grid-cols-3">
        <div :class="ui.card.stat">
          <p class="text-sm text-gray-500">My leave requests</p>
          <p class="mt-2 text-3xl font-bold">{{ myLeaveRequests.length }}</p>
        </div>

        <div :class="ui.card.stat">
          <p class="text-sm text-gray-500">Pending requests</p>
          <p class="mt-2 text-3xl font-bold">{{ myPendingLeaveRequests }}</p>
        </div>

        <div :class="ui.card.stat">
          <p class="text-sm text-gray-500">Approved requests</p>
          <p class="mt-2 text-3xl font-bold">{{ myApprovedLeaveRequests }}</p>
        </div>
      </section>

      <section class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold">Quick Actions</h2>
          <p class="text-sm text-gray-500">
            Use the main leave management actions.
          </p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div :class="ui.card.section">
            <h3 class="text-base font-semibold">My leave requests</h3>
            <p :class="ui.emptyState.text">
              View all your leave requests and check their statuses.
            </p>

            <div class="mt-4">
              <NuxtLink
                to="/leave"
                :class="ui.button.primary"
              >
                View my leave
              </NuxtLink>
            </div>
          </div>

          <div :class="ui.card.section">
            <h3 class="text-base font-semibold">Create leave request</h3>
            <p :class="ui.emptyState.text">
              Submit a new leave request for approval.
            </p>

            <div class="mt-4">
              <NuxtLink
                to="/leave/create"
                :class="ui.button.primary"
              >
                Create request
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>