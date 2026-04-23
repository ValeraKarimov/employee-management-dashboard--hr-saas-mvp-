<script setup lang="ts">
import { reactive } from 'vue';
import { navigateTo } from '#app';
import { useAuthStore } from '~/stores/auth';
import { useLeave } from '~/composables/useLeave';
import { ui } from '~/constants/ui';

definePageMeta({
    middleware: ['auth', 'role'],
    role: 'employee'
})

const auth = useAuthStore()
const { createLeave } = useLeave()

const form = reactive({
    startDate: '',
    endDate: '',
    reason: ''
})

const errors = reactive({
    startDate: '',
    endDate: '',
    reason: ''
})

const validateForm = () => {
    errors.startDate = ''
    errors.endDate = ''
    errors.reason = ''

    let isValid = true

    if (!form.startDate) {
        errors.startDate = 'Start date is required'
        isValid = false
    }

    if (!form.endDate) {
        errors.endDate = 'End date is required'
        isValid = false
    }

    if (!form.reason) {
        errors.reason = 'Reason is required'
        isValid = false
    }

    if (form.startDate && form.endDate && form.endDate < form.startDate) {
        errors.endDate = 'End date cannot be earlier than start date'
        isValid = false
    }

    return isValid
}

const handleSubmit = () => {
    if (!validateForm()) return;
    if (!auth.user) return;


    createLeave({
        userId: auth.user.id,
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason.trim()
    })

    navigateTo('/leave')
}

const handleCancel = () => {
    navigateTo('/leave')
}

</script>

<template>
    <div :class="ui.page.narrow">
        
        <div>
            <h1 :class="ui.page.title">Create Leave Request</h1>
            <p :class="ui.page.description">
                Submit a new leave request
            </p>
        </div>

        <form class="space-y-4 rounded-xl border bg-white p-6 shadow-sm" @submit.prevent="handleSubmit">
         
            <div :class="ui.form.field">
                <label :class="ui.form.label">Start Date</label>
                <input 
                    v-model="form.startDate"
                    type="date"
                    :class="ui.input.base"
                />
                <p
                    v-if="errors.startDate"
                    :class="ui.form.error"
                >
                    {{ errors.startDate }}
                </p>
            </div>

            <div :class="ui.form.field">
                <label :class="ui.form.label">End Date</label>
                <input 
                    v-model="form.endDate"
                    type="date"
                    :class="ui.input.base"
                />
                <p
                    v-if="errors.endDate"
                    class="mt-1 text-sm text-red-600"
                >
                    {{ errors.endDate }}
                </p>
            </div>

            <div :class="ui.form.field">
                <label :class="ui.form.label">Reason</label>
                <textarea 
                    v-model="form.reason"
                    rows="4"
                    :class="ui.input.base"
                    placeholder="Why do you need leave ?"
                />
                <p
                    v-if="errors.reason"
                    class="mt-1 text-sm text-red-600"
                >
                    {{ errors.reason }}
                </p>
            </div>

            <div :class="ui.form.actions">
                <button 
                    type="submit"
                    :class="ui.button.primary"
                >
                    Submit request
                </button>

                <button 
                    type="button"
                    :class="ui.button.secondary"
                    @click="handleCancel"
                >
                    Cancel
                </button>

            </div>

        </form>

    </div>
</template>