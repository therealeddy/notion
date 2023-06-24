import { contextBridge, ipcRenderer } from 'electron'

import { IPC } from '@shared/constants/ipc'
import { DocumentRequest, DocumentResponse } from '../shared/types/ipc'

declare global {
  export interface Window {
    api: typeof api
  }
}

const api = {
  fetchDocuments(): Promise<DocumentResponse.FetchAll> {
    return ipcRenderer.invoke(IPC.DOCUMENTS.FETCH_ALL)
  },

  fetchDocument(req: DocumentRequest.Fetch): Promise<DocumentResponse.Fetch> {
    return ipcRenderer.invoke(IPC.DOCUMENTS.FETCH, req)
  },

  createDocument(): Promise<DocumentResponse.Create> {
    return ipcRenderer.invoke(IPC.DOCUMENTS.CREATE)
  },

  saveDocument(req: DocumentRequest.Save): Promise<void> {
    return ipcRenderer.invoke(IPC.DOCUMENTS.SAVE, req)
  },

  deleteDocument(req: DocumentRequest.Delete): Promise<void> {
    return ipcRenderer.invoke(IPC.DOCUMENTS.DELETE, req)
  },

  onNewDocumentRequest(callback: () => void) {
    ipcRenderer.on('new-document', callback)

    return () => {
      ipcRenderer.off('new-document', callback)
    }
  },
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api
}
