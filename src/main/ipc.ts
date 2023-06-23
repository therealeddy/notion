import { ipcMain } from 'electron'

import { randomUUID } from 'node:crypto'

import { IPC } from '@shared/constants/ipc'
import { DocumentResponse, DocumentRequest, Document } from '@shared/types/ipc'
import { store } from './store'

ipcMain.handle(
  IPC.DOCUMENTS.FETCH_ALL,
  async (): Promise<DocumentResponse.FetchAll> => {
    return {
      data: Object.values(store.get('documents')),
    }
  },
)

ipcMain.handle(
  IPC.DOCUMENTS.FETCH,
  async (_, { id }: DocumentRequest.Fetch): Promise<DocumentResponse.Fetch> => {
    const document = store.get(`documents.${id}`) as Document

    return {
      data: document,
    }
  },
)

ipcMain.handle(
  IPC.DOCUMENTS.CREATE,
  async (): Promise<DocumentResponse.Create> => {
    const id = randomUUID()

    const document: Document = {
      id,
      title: 'Untitled',
    }

    store.set(`documents.${id}`, document)

    return {
      data: document,
    }
  },
)

ipcMain.handle(
  IPC.DOCUMENTS.SAVE,
  async (_, { id, title, content }: DocumentRequest.Save): Promise<void> => {
    store.set(`documents.${id}`, {
      id,
      title,
      content,
    })
  },
)

ipcMain.handle(
  IPC.DOCUMENTS.DELETE,
  async (_, { id }: DocumentRequest.Delete): Promise<void> => {
    // @ts-ignore (https://github.com/sindresorhus/electron-store/issues/196)
    store.delete(`documents.${id}`)
  },
)
