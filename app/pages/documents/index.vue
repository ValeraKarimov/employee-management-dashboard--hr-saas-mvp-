<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { useDocuments } from '~/composables/useDocuments'
import type { DocumentItem, UpdateDocumentPayload } from '~/types/document'
import { ui } from '~/constants/ui'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const { user: currentUser } = storeToRefs(authStore)

const {
  documents,
  loading,
  deleting,
  updating,
  loadMyDocuments,
  loadingAllDocuments,
  removeDocument,
  updateDocumentItem
} = useDocuments()

const isAdmin = computed(() => currentUser.value?.role === 'admin')
const canCreateDocument = computed(() => !isAdmin.value)
const canEditDocument = computed(() => isAdmin.value)
const canDeleteDocument = computed(() => isAdmin.value)

const editingDocumentId = ref<number | null>(null)

const editForm = reactive<UpdateDocumentPayload>({
  name: '',
  filename: '',
  type: '',
  status: 'active'
})

onMounted(() => {
  if (!currentUser.value) return

  if (isAdmin.value) {
    loadingAllDocuments()
    return
  }

  loadMyDocuments(currentUser.value.id)
})

const startEditing = (document: DocumentItem) => {
  if (!canEditDocument.value) return

  editingDocumentId.value = document.id
  editForm.name = document.name
  editForm.filename = document.filename
  editForm.type = document.type
  editForm.status = document.status
}

const cancelEditing = () => {
  editingDocumentId.value = null
  editForm.name = ''
  editForm.filename = ''
  editForm.type = ''
  editForm.status = 'active'
}

const handleUpdate = async (documentId: number) => {
  if (!canEditDocument.value) return

  const updated = await updateDocumentItem(documentId, {
    name: editForm.name,
    filename: editForm.filename,
    type: editForm.type,
    status: editForm.status
  })

  if (updated) {
    cancelEditing()
    await reloadDocuments()
  }
}

const handleDelete = async (documentId: number) => {
  if (!canDeleteDocument.value) return

  const confirmed = window.confirm('Are you sure you want to delete this document ?')
  if (!confirmed) return

  const success = await removeDocument(documentId)

  if (success) {
    await reloadDocuments()
  }
}

const reloadDocuments = async () => {
  if (!currentUser.value) return

  if (isAdmin.value) {
    await loadingAllDocuments()
    return
  }

  await loadMyDocuments(currentUser.value.id)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-bold">Documents</h1>
        <p class="text-sm text-gray-500">
          {{ isAdmin ? 'All employee documents' : 'My documents' }}
        </p>
      </div>

      <NuxtLink
        v-if="canCreateDocument"
        to="/documents/create"
        class="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
      >
        Add new document
      </NuxtLink>
    </div>

    <div v-if="loading" class="rounded-lg border p-4">
      Loading documents...
    </div>

    <div v-else-if="documents.length" class="overflow-hidden rounded-lg border bg-white shadow-sm">
      <table class="min-w-full divide-y">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold">Name</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">File Name</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">Type</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">Status</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">Uploaded At</th>
            <th
              v-if="canEditDocument || canDeleteDocument"
              class="px-4 py-3 text-left text-sm font-semibold"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody class="divide-y">
          <tr v-for="document in documents" :key="document.id">
            <template v-if="editingDocumentId === document.id">
              <td class="px-4 py-3 text-sm">
                <input
                  v-model="editForm.name"
                  type="text"
                  class="w-full rounded-lg border px-3 py-2"
                />
              </td>

              <td class="px-4 py-3 text-sm">
                <input
                  v-model="editForm.filename"
                  type="text"
                  class="w-full rounded-lg border px-3 py-2"
                />
              </td>

              <td class="px-4 py-3 text-sm">
                <input
                  v-model="editForm.type"
                  type="text"
                  class="w-full rounded-lg border px-3 py-2"
                />
              </td>

              <td class="px-4 py-3 text-sm">
                <select
                  v-model="editForm.status"
                  class="w-full rounded-lg border px-3 py-2"
                >
                  <option value="active">active</option>
                  <option value="archived">archived</option>
                </select>
              </td>

              <td class="px-4 py-3 text-sm">{{ document.uploadedAt }}</td>

              <td
                v-if="canEditDocument || canDeleteDocument"
                class="px-4 py-3 text-sm"
              >
                <div class="flex gap-2">
                  <button
                    v-if="canEditDocument"
                    class="rounded-lg border px-3 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
                    :disabled="updating || !editForm.name || !editForm.type"
                    @click="handleUpdate(document.id)"
                  >
                    {{ updating ? 'Saving...' : 'Save' }}
                  </button>

                  <button
                    v-if="canDeleteDocument"
                    class="rounded-lg border px-3 py-1 text-xs hover:bg-gray-50"
                    @click="cancelEditing"
                  >
                    Cancel
                  </button>
                </div>
              </td>
            </template>

            <template v-else>
              <td class="px-4 py-3 text-sm">{{ document.name }}</td>
              <td class="px-4 py-3 text-sm">{{ document.filename }}</td>
              <td class="px-4 py-3 text-sm">{{ document.type }}</td>
              <td class="px-4 py-3 text-sm">
                <span
                  class="rounded-full border px-2 py-1 text-xs"
                  :class="document.status === 'active'
                    ? ui.badge.statusActive
                    : ui.badge.statusInactive"
                >
                  {{ document.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm">{{ document.uploadedAt }}</td>
              <td
                v-if="canEditDocument || canDeleteDocument"
                class="px-4 py-3 text-sm"
              >
                <div class="flex gap-2">
                  <button
                    v-if="canEditDocument"
                    class="rounded-lg border px-3 py-1 text-xs hover:bg-gray-50"
                    @click="startEditing(document)"
                  >
                    Edit
                  </button>

                  <button
                    v-if="canDeleteDocument"
                    class="rounded-lg border px-3 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
                    :disabled="deleting"
                    @click="handleDelete(document.id)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="rounded-lg border p-4 text-sm text-gray-500">
      No documents found
    </div>
  </div>
</template>