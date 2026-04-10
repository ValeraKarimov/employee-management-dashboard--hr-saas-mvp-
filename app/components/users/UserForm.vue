<script setup lang="ts">

import { reactive, computed, watch } from 'vue';
import type { User, UserRole } from '~/types/user';
import { ui } from '~/constants/ui';

type UserFormData = Omit<User, 'id'>

const props = defineProps<{
    initialData?: Partial<UserFormData>
    submitLabel?: string
}>()

const emit = defineEmits<{
    submit: [payload: UserFormData]
    cancel: []
}>()

const form = reactive<UserFormData>({
    name: '',
    email: '',
    role: 'employee' as UserRole,
    department: '',
    position: '',
    status: 'active'
})

const errors = reactive<Record<string, string>>({
    name: '',
    email: '',
    role: '',
    status: ''
})

watch(
    () => props.initialData,
    (value) => {
        if (!value) return

        form.name = value.name ?? ''
        form.email = value.email ?? ''
        form.role = value.role ?? 'employee'
        form.department = value.department ?? ''
        form.position = value.position ?? ''
        form.status = value.status ?? 'active'
    },
    { immediate: true }
)

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validate = () => {
    errors.name = ''
    errors.email = ''
    errors.role = ''
    errors.status = ''

    let isValid = true

    if (!form.name.trim()) {
        errors.name = 'Name is required'
        isValid = false
    }


    if (!form.email.trim()) {
        errors.email = 'Email is required'
        isValid = false
    } else if (!emailRegex.test(form.email)) {
        errors.email = 'Invalid email format'
        isValid = false
    }


    if (!form.role.trim()) {
        errors.role = 'Role is required'
        isValid = false
    }


    if (!form.status.trim()) {
        errors.status = 'Status is required'
        isValid = false
    }

    return isValid
}

const isFormValid = computed(() => {
    return (
        form.name.trim() &&
        form.email.trim() &&
        emailRegex.test(form.email) &&
        form.role &&
        form.status
    )
})

const handleSubmit = () => {
    if (!validate()) return

    emit('submit', {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        department: form.department?.trim(),
        position: form.position?.trim(),
        status: form.status
    })
}
</script>

<template>
    <form action="" class="space-y-4 rounded-xl bordeer bg-white p-6 shadow-sm" @submit.prevent="handleSubmit">

        <div>
            <label class="mb-1 block text-sm font-medium">Name</label>
            
            <input
                v-model="form.name"
                type="text" 
                :class="ui.input.base" />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
        </div>

        <div>
            <label class="mb-1 block text-sm font-medium">Email</label>
            
            <input
                v-model="form.email"
                type="text" 
                :class="ui.input.base" />

            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>

        </div>

        <div>
            <label class="mb-1 block text-sm font-medium">Role</label>
            <select
                v-model="form.role"
                :class="ui.input.base"
            >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
            </select>
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.role }}</p>
        </div>
        
        <div>
            <label class="mb-1 block text-sm font-medium">Department</label>
            
            <input
                v-model="form.department"
                type="text"
                :class="ui.input.base"
            >
        </div>

        <div>
            <label class="mb-1 block text-sm font-medium">Position</label>
            
            <input
                v-model="form.position"
                type="text"
                :class="ui.input.base"    
            >
        </div>

        <div>
            <label class="mb-1 block text-sm font-medium">Status</label>
            <select
                v-model="form.status"
                :class="ui.input.base"    
            >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>
            <p v-if="errors.status" class="mt-1 text-sm text-red-600">{{ errors.status }}</p>
        </div>

        <div class="flex gap-3 pt-2">
            <button
                type="submit"
                :disabled="!isFormValid" 
                class="rounded-lg bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
                {{ submitLabel || 'Save' }}
            </button>

            <button
                type="button" 
                class="rounded-lg border px-4 py-2"
                @click="$emit('cancel')"
            >
            Cancel
            </button>

        </div>

    </form>
</template>
