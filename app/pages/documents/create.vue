<script setup lang="ts">
import { reactive, ref } from 'vue'
import { navigateTo } from '#app'
import { useAuthStore } from '~/stores/auth'
import { useDocuments } from '~/composables/useDocuments'
import type { CreateDocumentPayload } from '~/types/document'
import { ui } from '~/constants/ui'

definePageMeta({
  middleware: ['auth', 'role'],
  role: 'employee'
})

const auth = useAuthStore()
const { addDocuments } = useDocuments()

const selectedFile = ref<File | null>(null)

const form = reactive<CreateDocumentPayload>({
  userId: 0,
  name: '',
  filename: '',
  type: '',
  status: 'active'
})

const errors = reactive({
  name: '',
  filename: '',
  type: ''
})

const validateForm = () => {
  errors.name = ''
  errors.filename = ''
  errors.type = ''

  let isValid = true

  if (!form.name.trim()) {
    errors.name = 'Document name is required'
    isValid = false
  }

  if (!selectedFile.value) {
    errors.filename = 'File is required'
    isValid = false
  }

  if (!form.type.trim()) {
    errors.type = 'Type is required'
    isValid = false
  }

  return isValid
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0] ?? null

  selectedFile.value = file

  if (file) {
    form.filename = file.name
    return
  }

  form.filename = ''
}

const handleSubmit = async () => {
  if (!validateForm()) return
  if (!auth.user || !selectedFile.value) return

  const created = await addDocuments({
    userId: auth.user.id,
    name: form.name.trim(),
    filename: form.filename,
    type: form.type.trim(),
    status: form.status
  })

  if (created) {
    navigateTo('/documents')
  }
}

const handleCancel = () => {
  navigateTo('/documents')
}
</script>

<template>
  <div class="max-w-2xl space-y-6">
    <div>
      <h1 class="text-2xl font-bold">Add New Document</h1>
      <p class="text-sm text-gray-500">
        Upload a new employee document
      </p>
    </div>

    <form class="space-y-4 rounded-xl border bg-white p-6 shadow-sm" @submit.prevent="handleSubmit">
      <div>
        <label class="mb-1 block text-sm font-medium">Document Name</label>
        <input
          v-model="form.name"
          type="text"
          :class="ui.input.base"
          placeholder="Document name in the system"
        />
        <p
          v-if="errors.name"
          class="mt-1 text-sm text-red-600"
        >
          {{ errors.name }}
        </p>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium">File</label>
        <input
          type="file"
          :class="ui.input.base"
          @change="handleFileChange"
        />
        <p
          v-if="form.filename"
          class="mt-1 text-sm text-gray-500"
        >
          Selected file: {{ form.filename }}
        </p>
        <p
          v-if="errors.filename"
          class="mt-1 text-sm text-red-600"
        >
          {{ errors.filename }}
        </p>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium">Type</label>
        <input
          v-model="form.type"
          type="text"
          :class="ui.input.base"
          placeholder="Contract, Legal, Identification..."
        />
        <p
          v-if="errors.type"
          class="mt-1 text-sm text-red-600"
        >
          {{ errors.type }}
        </p>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium">Status</label>
        <select
          v-model="form.status"
          :class="ui.input.base"
        >
          <option value="active">active</option>
          <option value="archived">archived</option>
        </select>
      </div>

      <div class="flex gap-3 pt-2">
        <button
          type="submit"
          class="rounded-lg bg-black px-4 py-2 text-white"
        >
          Save document
        </button>

        <button
          type="button"
          class="rounded-lg border px-4 py-2"
          @click="handleCancel"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>