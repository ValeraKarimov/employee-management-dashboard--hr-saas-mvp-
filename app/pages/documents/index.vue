<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { useDocuments } from '~/composables/useDocuments'
import type { DocumentItem, UpdateDocumentPayload } from '~/types/document'
import { ui } from '~/constants/ui'

definePageMeta({
  layout: 'default',
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
  <div :class="ui.page.wrapper">
    <div :class="ui.page.header">
      <div>
        <h1 :class="ui.page.title">Documents</h1>
        <p :class="ui.page.description">
          {{ isAdmin ? 'All employee documents' : 'My documents' }}
        </p>
      </div>

      <NuxtLink
        v-if="canCreateDocument"
        to="/documents/create"
        :class="ui.button.primary"
      >
        Add new document
      </NuxtLink>
    </div>

    <div v-if="loading" :class="ui.emptyState.base">
      <h2 :class="ui.emptyState.title">Loading documents...</h2>
      <p :class="ui.emptyState.text">Please wait while the documents list is loading.</p>
    </div>

    <div v-else-if="documents.length" :class="ui.table.wrapper">
      <table :class="ui.table.table">
        <thead :class="ui.table.thead">
          <tr :class="ui.table.row">
            <th :class="ui.table.th">Name</th>
            <th :class="ui.table.th">File Name</th>
            <th :class="ui.table.th">Type</th>
            <th :class="ui.table.th">Status</th>
            <th :class="ui.table.th">Uploaded At</th>
            <th
              v-if="canEditDocument || canDeleteDocument"
              :class="ui.table.th"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="document in documents" :key="document.id" :class="ui.table.row">
            <template v-if="editingDocumentId === document.id">
              <td :class="ui.table.td">
                <input
                  v-model="editForm.name"
                  type="text"
                  :class="ui.input.base"
                />
              </td>

              <td :class="ui.table.td">
                <input
                  v-model="editForm.filename"
                  type="text"
                  :class="ui.input.base"
                />
              </td>

              <td :class="ui.table.td">
                <input
                  v-model="editForm.type"
                  type="text"
                  :class="ui.input.base"
                />
              </td>

              <td :class="ui.table.td">
                <select
                  v-model="editForm.status"
                  :class="ui.input.base"
                >
                  <option value="active">active</option>
                  <option value="archived">archived</option>
                </select>
              </td>

              <td :class="ui.table.td">{{ document.uploadedAt }}</td>

              <td
                v-if="canEditDocument || canDeleteDocument"
                :class="ui.table.td"
              >
                <div :class="ui.actions.row">
                  <button
                    v-if="canEditDocument"
                    :class="ui.button.secondary"
                    :disabled="updating || !editForm.name || !editForm.type"
                    @click="handleUpdate(document.id)"
                  >
                    {{ updating ? 'Saving...' : 'Save' }}
                  </button>

                  <button
                    v-if="canDeleteDocument"
                    :class="ui.button.secondary"
                    @click="cancelEditing"
                  >
                    Cancel
                  </button>
                </div>
              </td>
            </template>

            <template v-else>
              <td :class="ui.table.td">{{ document.name }}</td>
              <td :class="ui.table.td">{{ document.filename }}</td>
              <td :class="ui.table.td">{{ document.type }}</td>
              <td :class="ui.table.td">
                <span
                  :class="[
                    ui.badge.base, 
                    document.status === 'active'
                      ? ui.badge.statusActive
                      : ui.badge.statusInactive
                  ]"
                >
                  {{ document.status }}
                </span>
              </td>
              <td :class="ui.table.td">{{ document.uploadedAt }}</td>
              <td
                v-if="canEditDocument || canDeleteDocument"
                :class="ui.table.td"
              >
                <div :class="ui.actions.row">
                  <button
                    v-if="canEditDocument"
                    :class="ui.button.secondary"
                    @click="startEditing(document)"
                  >
                    Edit
                  </button>

                  <button
                    v-if="canDeleteDocument"

                    :class="ui.button.danger"
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

    <div v-else :class="ui.emptyState.base">
      No documents found
    </div>
  </div>
</template>