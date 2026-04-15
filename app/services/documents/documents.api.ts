import type { CreateDocumentPayload, DocumentItem, UpdateDocumentPayload } from "~/types/document";

export const getMyDocumentApi = async (userId: number): Promise<DocumentItem[]> => {
    console.log('TODO: get my documents from API')
    return []
}

export const getAllMyDocumentApi = async (): Promise<DocumentItem[]> => {
    console.log('TODO: get my documents from API')
    return []
}

export const createDocumentApi = async (
    _payload: CreateDocumentPayload
): Promise<DocumentItem | null> => {
    console.log('TODO created document via API')
    return null
}

export const deleteDocumentApi = async (_documentId: number): Promise<boolean> => {
    console.log('TODO: delete document via API')
    return false
}

export const updatedDocumentApi = async (_documentId: number, _payload: UpdateDocumentPayload): Promise<DocumentItem | null> => {
    console.log('TODO: update document via API')
    return null
}