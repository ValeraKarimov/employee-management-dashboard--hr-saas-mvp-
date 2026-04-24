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
const { users, loadUsers } = useUsers()
const { leaveRequests, loadLeaves, loadMyLeaves } = useLeave()

const currentUser = computed(() => auth.user)


const isAdmin = computed(() => currentUser.value?.role === 'admin')
const isEmployee = computed(() => currentUser.value?.role === 'employee')

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

const myLeaveRequests = computed(() => leaveRequests.value)


const myPendingLeaveRequests = computed(() => {
  return myLeaveRequests.value.filter(r => r.status === 'pending').length
})

const myApprovedLeaveRequests = computed(() => {
  return myLeaveRequests.value.filter(r => r.status === 'approved').length
})

onMounted(async () => {
  if(!currentUser.value) return
  
  await loadUsers()

  if (currentUser.value.role === 'admin') {
    await loadLeaves()
  } else {
    await loadMyLeaves(currentUser.value.id)
  }

})

</script>

<template>
  <div :class="ui.page.wrapper">
    <section>
      <h1 :class="ui.page.title">Overview</h1>
      <p :class="ui.page.description">A quick summary of your HR workspace.</p>
    </section>

    <template v-if="isAdmin">
      <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div :class="ui.card.stat">
          <p :class="ui.card.statLabel">Total users</p>
          <p :class="ui.card.statValue">{{ totalUsers }}</p>
        </div>

        <div :class="ui.card.stat">
          <p :class="ui.card.statLabel">Admins</p>
          <p :class="ui.card.statValue">{{ totalAdmins }}</p>
        </div>

        <div :class="ui.card.stat">
          <p :class="ui.card.statLabel">Employees</p>
          <p :class="ui.card.statValue">{{ totalEmployees }}</p>
        </div>

        <div :class="ui.card.stat">
          <p :class="ui.card.statLabel">Pending leave requests</p>
          <p :class="ui.card.statValue">{{ pendingLeaveRequests }}</p>
        </div>
      </section>

      <section class="space-y-4">
        <div>
          <h2 :class="ui.emptyState.title">Quick Actions</h2>
          <p :class="ui.page.description">
            Jump directly to the main admin workflows.
          </p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div :class="ui.card.section">
            <h3 :class="ui.emptyState.title">Users management</h3>
            <p :class="ui.emptyState.text">
              Create, edit and manage employee and admin accounts.
            </p>

            <div :class="ui.card.actions">
              <NuxtLink
                to="/admin/users"
                :class="ui.button.primary"
              >
                Manage users
              </NuxtLink>
            </div>
          </div>

          <div :class="ui.card.section">
            <h3 :class="ui.emptyState.title">Leave requests</h3>
            <p :class="ui.emptyState.text">
              Review and update employee leave request statuses.
            </p>

            <div :class="ui.card.actions">
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
          <p :class="ui.card.statLabel">My leave requests</p>
          <p :class="ui.card.statValue">{{ myLeaveRequests.length }}</p>
        </div>

        <div :class="ui.card.stat">
          <p :class="ui.card.statLabel">Pending requests</p>
          <p :class="ui.card.statValue">{{ myPendingLeaveRequests }}</p>
        </div>

        <div :class="ui.card.stat">
          <p :class="ui.card.statLabel">Approved requests</p>
          <p :class="ui.card.statValue">{{ myApprovedLeaveRequests }}</p>
        </div>
      </section>

      <section class="space-y-4">
        <div>
          <h2 :class="ui.emptyState.title">Quick Actions</h2>
          <p :class="ui.card.statLabel">
            Use the main leave management actions.
          </p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div :class="ui.card.section">
            <h3 :class="ui.emptyState.title">My leave requests</h3>
            <p :class="ui.emptyState.text">
              View all your leave requests and check their statuses.
            </p>

            <div :class="ui.card.actions">
              <NuxtLink
                to="/leave"
                :class="ui.button.primary"
              >
                View my leave
              </NuxtLink>
            </div>
          </div>

          <div :class="ui.card.section">
            <h3 :class="ui.emptyState.title">Create leave request</h3>
            <p :class="ui.emptyState.text">
              Submit a new leave request for approval.
            </p>

            <div :class="ui.card.actions">
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