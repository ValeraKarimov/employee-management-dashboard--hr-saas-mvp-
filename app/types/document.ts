export interface DocumentItem {
    id: number
    userId: number
    name: string
    type: string
    status: 'active' | 'archived'
    uploadedAt: string
}

export type CreateDocumentPayload = {
    userId: number
    name: string
    type: string
    status: 'active' | 'archived'
}