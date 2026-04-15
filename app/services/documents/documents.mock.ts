import type { DocumentItem, CreateDocumentPayload, UpdateDocumentPayload } from "~/types/document";

const documents: DocumentItem[] = [
    {
        id: 1,
        userId: 1,
        name: 'Employment_contract.pdf',
        type: 'Contract',
        status: 'active',
        uploadedAt: '2026-04-03'
    },
    {
        id: 2,
        userId: 2,
        name: 'Passport_copy.pdf',
        type: 'Identification',
        status: 'active',
        uploadedAt: '2026-04-03'
    },
    {
        id: 3,
        userId: 2,
        name: 'NDA Agreement.pdf',
        type: 'Legal',
        status: 'archived',
        uploadedAt: '2026-04-03'
    },
]

export const getMyDocumentMock = async (userId: number): Promise<DocumentItem[]> => {
    return documents.filter(d => d.userId === userId)
}

export const getAllMyDocumentMock = async (): Promise<DocumentItem[]> => {
    return documents
}

export const createDocumentMock = async(payload: CreateDocumentPayload): Promise<DocumentItem> => {
    const newDocument: DocumentItem = {
        id: Date.now(),
        userId: payload.userId,
        name: payload.name,
        type: payload.type,
        status: payload.status,
        uploadedAt: new Date().toISOString().slice(0, 10)
    }

    documents.unshift(newDocument)

    return newDocument
}

export const deleteDocumentMock = async (documentId: number): Promise<boolean> => {
    const documentIndex = documents.findIndex(document => document.id === documentId)

    if (documentIndex === -1) {
        return false
    }


    documents.splice(documentIndex, -1)

    return true
}

export const updateDocumentMock = async (
    documentId: number,
    payload: UpdateDocumentPayload
): Promise<DocumentItem | null> => {
    const documentIndex = documents.findIndex(document => document.id === documentId)

    if (documentIndex === -1) {
        return null
    }

    const currentDocument = documents[documentIndex]

    if (!currentDocument) {
        return null
    }

    const updatedDocument: DocumentItem = {
        ...currentDocument,
        ...payload
    }

    documents[documentIndex] = updatedDocument

    return updatedDocument
}