import { dataSource } from "~/config/data-source";
import { getMyDocumentMock, getAllMyDocumentMock, createDocumentMock, deleteDocumentMock } from "./documents.mock";
import { getMyDocumentApi, getAllMyDocumentApi, createDocumentApi, deleteDocumentApi } from "./documents.api";
import type { DocumentItem, CreateDocumentPayload } from "~/types/document";

export const getMyDocuments = async (userId: number): Promise<DocumentItem[]> => {
    if (dataSource === 'mock') {
        return getMyDocumentMock(userId)
    }
    return getMyDocumentApi(userId)
}

export const getAllDocuments = async (): Promise<DocumentItem[]> => {
    if (dataSource === 'mock') {
        return getAllMyDocumentMock()
    }
    return getAllMyDocumentApi()
}

export const createDocument = async (
    payload: CreateDocumentPayload
): Promise<DocumentItem | null> => {
    if (dataSource === 'mock') {
        return createDocumentMock(payload)
    }

    return createDocumentApi(payload)
}

export const deleteDocument = async (documentId: number): Promise<boolean> => {
    if(dataSource === 'mock') {
        return deleteDocumentMock(documentId)
    }

    return deleteDocumentApi(documentId)
}