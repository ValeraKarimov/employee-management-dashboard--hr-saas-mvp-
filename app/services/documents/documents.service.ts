import { dataSource } from "~/config/data-source";
import { getMyDocumentMock, getAllMyDocumentMock, createDocumentMock, deleteDocumentMock, updateDocumentMock } from "./documents.mock";
import { getMyDocumentApi, getAllMyDocumentApi, createDocumentApi, deleteDocumentApi, updatedDocumentApi } from "./documents.api";
import type { DocumentItem, CreateDocumentPayload, UpdateDocumentPayload } from "~/types/document";

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

export const updateDocument = async (
    documentId: number,
    payload: UpdateDocumentPayload
): Promise<DocumentItem | null> => {
    if (dataSource === 'mock') {
        return updateDocumentMock(documentId, payload)
    }

    return updatedDocumentApi(documentId, payload)
}