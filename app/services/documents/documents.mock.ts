import type { DocumentItem, CreateDocumentPayload, UpdateDocumentPayload } from "~/types/document";

const initialDocuments: DocumentItem[] = [
    {
        id: 1,
        userId: 1,
        name: 'Employment contract',
        filename: 'Employment_contract.pdf',
        type: 'Contract',
        status: 'active',
        uploadedAt: '2026-04-03'
    },
    {
        id: 2,
        userId: 2,
        name: 'Passport copy',
        filename: 'Passport_copy.pdf',
        type: 'Identification',
        status: 'active',
        uploadedAt: '2026-04-03'
    },
    {
        id: 3,
        userId: 2,
        name: 'NDA Agreement',
        filename: 'NDA_Agreement.pdf',
        type: 'Legal',
        status: 'archived',
        uploadedAt: '2026-04-03'
    },
]

let documentsDb: DocumentItem[] = [...initialDocuments]

const cloneDocument = (doc: DocumentItem): DocumentItem => ({
    ...doc
})


export const getMyDocumentMock = async (userId: number): Promise<DocumentItem[]> => {
    // return initialDocuments.filter(d => d.userId === userId)
    return documentsDb
    .filter(doc => doc.userId === userId)
    .map(cloneDocument)
}

export const getAllMyDocumentMock = async (): Promise<DocumentItem[]> => {
    // return initialDocuments
    return documentsDb.map(cloneDocument)
}

export const createDocumentMock = async(payload: CreateDocumentPayload): Promise<DocumentItem> => {
    const nextId = documentsDb.length > 0
        ? Math.max(...documentsDb.map(doc => doc.id)) + 1
        : 1
    
    const newDocument: DocumentItem = {
        id: nextId,
        userId: payload.userId,
        name: payload.name,
        filename: payload.filename,
        type: payload.type,
        status: payload.status,
        uploadedAt: new Date().toISOString().slice(0, 10)
    }

    documentsDb = [newDocument, ...documentsDb]

    return cloneDocument(newDocument)
}

export const deleteDocumentMock = async (documentId: number): Promise<boolean> => {

    const normalizeId = Number(documentId)
    const beforeCount = documentsDb.length

    documentsDb = documentsDb.filter(doc => Number(doc.id) !== normalizeId)

    return documentsDb.length < beforeCount

    // const documentIndex = initialDocuments.findIndex(document => document.id === documentId)

    // if (documentIndex === -1) {
    //     return false
    // }


    // initialDocuments.splice(documentIndex, -1)

    // return true
}

export const updateDocumentMock = async (
    documentId: number,
    payload: UpdateDocumentPayload
): Promise<DocumentItem | null> => {

    const normalizeId = Number(documentId)

    const documentIndex = documentsDb.findIndex(doc => Number(doc.id) === normalizeId)

    if (documentIndex === -1) {
        return null
    }

    const currentDocument = documentsDb[documentIndex]

    if (!currentDocument) {
        return null
    }

    const updatedDocument: DocumentItem = {
        ...currentDocument,
        ...payload
    }

    documentsDb[documentIndex] = updatedDocument

    return cloneDocument(updatedDocument)
}