import { ref } from "vue";
import type { DocumentItem, CreateDocumentPayload, UpdateDocumentPayload} from "~/types/document";
import { getMyDocuments, getAllDocuments, createDocument, deleteDocument, updateDocument } from "~/services/documents/documents.service";

export const useDocuments = () => {
    const documents = ref<DocumentItem[]>([])
    const loading = ref(false)
    const saving = ref(false)
    const deleting = ref(false)
    const updating = ref(false)

    const loadMyDocuments = async(userId: number) => {
        loading.value = true

        try {
            documents.value = await getMyDocuments(userId)
        } finally {
            loading.value = false
        }
    }

    const loadingAllDocuments = async () => {
        loading.value = true
        
        try {
            documents.value = await getAllDocuments()
        } finally {
            loading.value = false
        }

    }

    const addDocuments = async (payload: CreateDocumentPayload) => {
        saving.value = true

        try {
            // const createdDocument = await createDocument(payload)

            // if (createdDocument) {
            //     documents.value.unshift(createdDocument)
            // }

            // return createdDocument

            return await createDocument(payload)

        } finally {
            saving.value = false
        }
    }

    const removeDocument = async (documentId: number) => {
        deleting.value = true

        try {
            // const success = await deleteDocument(documentId)

            // if(success) {
            //     documents.value = documents.value.filter(d => d.id !== documentId)
            // }
            
            // return success

            return await deleteDocument(documentId)

        } finally {
            deleting.value = false
        }
    }

    const updateDocumentItem = async (
        documentId: number,
        payload: UpdateDocumentPayload
    ) => {
        updating.value = true

        try {
        // const updatedDocument = await updateDocument(documentId, payload)

        // if (updatedDocument) {
        //     documents.value = documents.value.map(doc =>
        //     doc.id === documentId ? updatedDocument : doc
        //     )
        // }

        // return updatedDocument

        return await updateDocument(documentId, payload)

        } finally {
        updating.value = false
        }
    }

    return {
        documents,
        loading,
        saving,
        deleting,
        updating,
        loadMyDocuments,
        loadingAllDocuments,
        addDocuments,
        removeDocument,
        updateDocumentItem
    }


}

