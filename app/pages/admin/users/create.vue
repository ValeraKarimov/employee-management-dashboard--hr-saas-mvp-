<script setup lang="ts">
import { navigateTo } from '#app';
import UserForm from '~/components/users/UserForm.vue';
import { useUsers } from '~/composables/useUsers';
import type { User } from '~/types/user';
import { ui } from '~/constants/ui';

definePageMeta({
  middleware: ['auth', 'role'],
  role: 'admin'
})

const { createUser } = useUsers()

const handleSubmit = (payload: Omit<User, 'id'>) => {
  createUser(payload)
  navigateTo('/admin/users')
}

const handleCancel = () => {
  navigateTo('/admin/users')
}

</script>


<template>
  <div :class="ui.page.narrow">
    <div>
      <h1 :class="ui.page.title">Create User</h1>
      <p :class="ui.page.description">Add a new employee or admin</p>
    </div>

  <UserForm
    submit-label="Create user"
    @submit="handleSubmit"
    @cancel="handleCancel"  
  />

  </div>

</template>