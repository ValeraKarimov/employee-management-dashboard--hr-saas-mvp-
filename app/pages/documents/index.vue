<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { useDocuments } from '~/composables/useDocuments'
import type { CreateDocumentPayload } from '~/types/document'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const { user: currentUser } = storeToRefs(authStore)

const {
  documents,
  loading,
  saving,
  deleting,
  loadMyDocuments,
  loadingAllDocuments,
  addDocuments,
  removeDocument
} = useDocuments()

const isAdmin = computed(() => currentUser.value?.role === 'admin')

const form = reactive<CreateDocumentPayload>({
  userId: 0,
  name: '',
  type: '',
  status: 'active'
})

onMounted(() => {
  if (!currentUser.value) return

  form.userId = currentUser.value.id

  if (isAdmin.value) {
    loadingAllDocuments()
    return
  }

  loadMyDocuments(currentUser.value.id)
})

const resetForm = () => {
  if (!currentUser.value) return

  form.userId = currentUser.value.id
  form.name = ''
  form.type = ''
  form.status = 'active'
}

const handleSubmit = async () => {
  if (!currentUser.value) return

  const created = await addDocuments({
    userId: currentUser.value.id,
    name: form.name,
    type: form.type,
    status: form.status
  })

  if (created) {
    resetForm()
  }
}

const handleDelete = async (documentId: number) => {
  await removeDocument(documentId)
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">Documents</h1>
      <p class="text-sm text-gray-500">
        {{ isAdmin ? 'All employee documents' : 'My documents' }}
      </p>
    </div>

    <div class="rounded-lg border bg-white p-6 shadow-sm">
      <h2 class="mb-4 text-lg font-semibold">Add document</h2>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="grid gap-4 md:grid-cols-3">
          <div>
            <label class="mb-1 block text-sm text-gray-500">Name</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full rounded-lg border px-3 py-2"
              placeholder="Document name"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm text-gray-500">Type</label>
            <input
              v-model="form.type"
              type="text"
              class="w-full rounded-lg border px-3 py-2"
              placeholder="Contract, Legal, Identification..."
            />
          </div>

          <div>
            <label class="mb-1 block text-sm text-gray-500">Status</label>
            <select
              v-model="form.status"
              class="w-full rounded-lg border px-3 py-2"
            >
              <option value="active">active</option>
              <option value="archived">archived</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          class="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          :disabled="saving || !form.name || !form.type"
        >
          {{ saving ? 'Saving...' : 'Add document' }}
        </button>
      </form>
    </div>

    <div v-if="loading" class="rounded-lg border p-4">
      Loading documents...
    </div>

    <div v-else-if="documents.length" class="overflow-hidden rounded-lg border bg-white shadow-sm">
      <table class="min-w-full divide-y">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold">Name</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">Type</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">Status</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">Uploaded At</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y">
          <tr v-for="document in documents" :key="document.id">
            <td class="px-4 py-3 text-sm">{{ document.name }}</td>
            <td class="px-4 py-3 text-sm">{{ document.type }}</td>
            <td class="px-4 py-3 text-sm">
              <span class="rounded-full border px-2 py-1 text-xs">
                {{ document.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm">{{ document.uploadedAt }}</td>
            <td class="px-4 py-3 text-sm">
              <button
                class="rounded-lg border px-3 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
                :disabled="deleting"
                @click="handleDelete(document.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="rounded-lg border p-4 text-sm text-gray-500">
      No documents found
    </div>
  </div>
</template>